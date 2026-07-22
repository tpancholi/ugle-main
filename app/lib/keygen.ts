import { randomUUID } from "crypto";
import { keygenConfig } from "@/app/lib/env";
import { fetchWithBackoff } from "@/app/lib/fetch-retry";
import type { PaidPlan, Plan } from "@/app/lib/pricing";

type KeygenResource = {
  id: string;
  type: string;
  attributes: Record<string, unknown>;
};

type KeygenResponse = {
  data?: KeygenResource | KeygenResource[];
  errors?: Array<{ title?: string; detail?: string; code?: string }>;
};

/**
 * Mock mode: when KEYGEN_MOCK=true, no real Keygen API calls are made.
 * The full checkout/webhook/DB/email pipeline still runs with a fake key,
 * so testing never consumes the paid Keygen active-license quota.
 */
function isKeygenMock(): boolean {
  return process.env.KEYGEN_MOCK === "true";
}

function mockExpiryFor(plan: Plan): string {
  const d = new Date();
  if (plan === "trial") d.setDate(d.getDate() + 15);
  else if (plan === "monthly") d.setMonth(d.getMonth() + 1);
  else d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
}

function mockLicense(plan: Plan): CreatedLicense {
  const raw = randomUUID().replace(/-/g, "").toUpperCase();
  const key = `MOCK-${raw.slice(0, 6)}-${raw.slice(6, 12)}-${raw.slice(12, 18)}`;
  return {
    id: `mock_${randomUUID()}`,
    key,
    expiry: mockExpiryFor(plan),
    status: "ACTIVE",
  };
}

function requireKeygen() {
  if (!keygenConfig.success) {
    throw new Error("Keygen is not configured");
  }
  return keygenConfig.data;
}

function policyIdForPlan(plan: Plan): string {
  const cfg = requireKeygen();
  if (plan === "trial") return cfg.KEYGEN_POLICY_TRIAL;
  if (plan === "monthly") return cfg.KEYGEN_POLICY_MONTHLY;
  return cfg.KEYGEN_POLICY_ANNUAL;
}

async function keygenFetch(
  path: string,
  init: RequestInit = {},
): Promise<KeygenResponse> {
  const cfg = requireKeygen();
  const url = `https://api.keygen.sh/v1/accounts/${cfg.KEYGEN_ACCOUNT_ID}${path}`;
  const res = await fetchWithBackoff(url, {
    ...init,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${cfg.KEYGEN_PRODUCT_TOKEN}`,
      ...(init.headers ?? {}),
    },
  });

  if (res.status === 204) return {};

  const body = (await res.json()) as KeygenResponse;
  if (!res.ok) {
    const detail =
      body.errors?.map((e) => e.detail || e.title).join("; ") ||
      `Keygen request failed (${res.status})`;
    throw new Error(detail);
  }
  return body;
}

export type CreatedLicense = {
  id: string;
  key: string;
  expiry: string | null;
  status: string;
  metadata?: Record<string, unknown>;
};

function asSingle(data: KeygenResponse["data"]): KeygenResource {
  if (!data || Array.isArray(data)) {
    throw new Error("Keygen did not return a license");
  }
  return data;
}

function mapLicense(data: KeygenResource): CreatedLicense {
  return {
    id: data.id,
    key: String(data.attributes.key ?? ""),
    expiry: (data.attributes.expiry as string | null) ?? null,
    status: String(data.attributes.status ?? "ACTIVE"),
    metadata: (data.attributes.metadata as Record<string, unknown> | undefined) ?? {},
  };
}

export async function getKeygenLicense(licenseId: string): Promise<CreatedLicense> {
  if (isKeygenMock()) {
    return { ...mockLicense("monthly"), id: licenseId, metadata: {} };
  }
  const body = await keygenFetch(`/licenses/${licenseId}`);
  return mapLicense(asSingle(body.data));
}

/** True if this Cashfree order already mutated the Keygen licence (retry-safe). */
export function keygenAlreadyAppliedToOrder(
  license: CreatedLicense,
  cashfreeOrderId: string,
): boolean {
  return license.metadata?.lastCashfreeOrderId === cashfreeOrderId;
}

export async function createKeygenLicense(opts: {
  plan: Plan;
  email: string;
  name?: string;
  cashfreeOrderId?: string;
}): Promise<CreatedLicense> {
  if (isKeygenMock()) return mockLicense(opts.plan);
  const body = await keygenFetch("/licenses", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "licenses",
        attributes: {
          name: opts.name ?? opts.email,
          metadata: {
            email: opts.email,
            plan: opts.plan,
            source: "website",
            ...(opts.cashfreeOrderId
              ? { lastCashfreeOrderId: opts.cashfreeOrderId }
              : {}),
          },
        },
        relationships: {
          policy: {
            data: { type: "policies", id: policyIdForPlan(opts.plan) },
          },
        },
      },
    }),
  });

  return mapLicense(asSingle(body.data));
}

/** Extend expiry by renewing against the current policy (same key). */
export async function renewKeygenLicense(
  licenseId: string,
): Promise<CreatedLicense> {
  if (isKeygenMock()) return { ...mockLicense("monthly"), id: licenseId };
  const body = await keygenFetch(`/licenses/${licenseId}/actions/renew`, {
    method: "POST",
  });
  return mapLicense(asSingle(body.data));
}

/**
 * Atomically set expiry + lastCashfreeOrderId. Idempotent when metadata already
 * records this Cashfree order (safe webhook retries).
 */
export async function extendKeygenLicenseForOrder(
  licenseId: string,
  plan: PaidPlan,
  cashfreeOrderId: string,
  knownRemote?: CreatedLicense,
): Promise<CreatedLicense> {
  if (isKeygenMock()) {
    return {
      ...mockLicense(plan),
      id: licenseId,
      metadata: { lastCashfreeOrderId: cashfreeOrderId, plan },
    };
  }
  const current = knownRemote ?? (await getKeygenLicense(licenseId));
  if (keygenAlreadyAppliedToOrder(current, cashfreeOrderId)) {
    return current;
  }

  const base =
    current.expiry && new Date(current.expiry) > new Date()
      ? new Date(current.expiry)
      : new Date();
  if (plan === "monthly") {
    base.setMonth(base.getMonth() + 1);
  } else {
    base.setFullYear(base.getFullYear() + 1);
  }

  const body = await keygenFetch(`/licenses/${licenseId}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "licenses",
        id: licenseId,
        attributes: {
          expiry: base.toISOString(),
          metadata: {
            ...(current.metadata ?? {}),
            plan,
            source: "website",
            lastCashfreeOrderId: cashfreeOrderId,
          },
        },
        relationships: {
          policy: {
            data: { type: "policies", id: policyIdForPlan(plan) },
          },
        },
      },
    }),
  });
  return mapLicense(asSingle(body.data));
}

export async function changeKeygenLicensePolicy(
  licenseId: string,
  plan: PaidPlan,
): Promise<CreatedLicense> {
  if (isKeygenMock()) return { ...mockLicense(plan), id: licenseId };
  const body = await keygenFetch(`/licenses/${licenseId}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "licenses",
        id: licenseId,
        attributes: {
          metadata: { plan },
        },
        relationships: {
          policy: {
            data: { type: "policies", id: policyIdForPlan(plan) },
          },
        },
      },
    }),
  });
  return mapLicense(asSingle(body.data));
}

/**
 * Convert trial → paid (or switch plan). New term is from now; never shrink
 * remaining paid time (annual→monthly must not drop unused months).
 */
export async function convertKeygenLicenseToPaid(
  licenseId: string,
  plan: PaidPlan,
  cashfreeOrderId?: string,
  knownRemote?: CreatedLicense,
): Promise<CreatedLicense> {
  if (isKeygenMock()) return { ...mockLicense(plan), id: licenseId };
  const current = knownRemote ?? (await getKeygenLicense(licenseId));
  if (cashfreeOrderId && keygenAlreadyAppliedToOrder(current, cashfreeOrderId)) {
    return current;
  }

  const termEnd = new Date();
  if (plan === "monthly") {
    termEnd.setMonth(termEnd.getMonth() + 1);
  } else {
    termEnd.setFullYear(termEnd.getFullYear() + 1);
  }
  const priorExpiry = current.expiry ? new Date(current.expiry) : null;
  const base =
    priorExpiry && priorExpiry > termEnd ? priorExpiry : termEnd;

  const body = await keygenFetch(`/licenses/${licenseId}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "licenses",
        id: licenseId,
        attributes: {
          expiry: base.toISOString(),
          metadata: {
            ...(current.metadata ?? {}),
            plan,
            source: "website",
            ...(cashfreeOrderId ? { lastCashfreeOrderId: cashfreeOrderId } : {}),
          },
        },
        relationships: {
          policy: {
            data: { type: "policies", id: policyIdForPlan(plan) },
          },
        },
      },
    }),
  });
  return mapLicense(asSingle(body.data));
}

export async function suspendKeygenLicense(licenseId: string): Promise<void> {
  if (isKeygenMock()) return;
  await keygenFetch(`/licenses/${licenseId}/actions/suspend`, {
    method: "POST",
  });
}

export async function reinstateKeygenLicense(licenseId: string): Promise<void> {
  if (isKeygenMock()) return;
  await keygenFetch(`/licenses/${licenseId}/actions/reinstate`, {
    method: "POST",
  });
}

export async function revokeKeygenLicense(licenseId: string): Promise<void> {
  if (isKeygenMock()) return;
  await keygenFetch(`/licenses/${licenseId}/actions/revoke`, {
    method: "POST",
  });
}

export async function listKeygenMachines(licenseId: string): Promise<
  Array<{ id: string; fingerprint: string; name: string | null }>
> {
  if (isKeygenMock()) return [];
  const body = await keygenFetch(`/licenses/${licenseId}/machines`);
  const list = Array.isArray(body.data) ? body.data : body.data ? [body.data] : [];
  return list.map((m) => ({
    id: m.id,
    fingerprint: String(m.attributes.fingerprint ?? ""),
    name: (m.attributes.name as string | null) ?? null,
  }));
}

export async function deleteKeygenMachine(machineId: string): Promise<void> {
  if (isKeygenMock()) return;
  await keygenFetch(`/machines/${machineId}`, { method: "DELETE" });
}
