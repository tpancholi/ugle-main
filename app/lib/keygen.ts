import { keygenConfig } from "@/app/lib/env";
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
  const res = await fetch(url, {
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
  };
}

export async function createKeygenLicense(opts: {
  plan: Plan;
  email: string;
  name?: string;
}): Promise<CreatedLicense> {
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
  const body = await keygenFetch(`/licenses/${licenseId}/actions/renew`, {
    method: "POST",
  });
  return mapLicense(asSingle(body.data));
}

export async function changeKeygenLicensePolicy(
  licenseId: string,
  plan: PaidPlan,
): Promise<CreatedLicense> {
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

/** Convert trial → paid (or switch plan) and set a fresh term from now. */
export async function convertKeygenLicenseToPaid(
  licenseId: string,
  plan: PaidPlan,
): Promise<CreatedLicense> {
  const expiry = new Date();
  if (plan === "monthly") {
    expiry.setMonth(expiry.getMonth() + 1);
  } else {
    expiry.setFullYear(expiry.getFullYear() + 1);
  }

  const body = await keygenFetch(`/licenses/${licenseId}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "licenses",
        id: licenseId,
        attributes: {
          expiry: expiry.toISOString(),
          metadata: { plan, source: "website" },
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
  await keygenFetch(`/licenses/${licenseId}/actions/suspend`, {
    method: "POST",
  });
}

export async function reinstateKeygenLicense(licenseId: string): Promise<void> {
  await keygenFetch(`/licenses/${licenseId}/actions/reinstate`, {
    method: "POST",
  });
}

export async function revokeKeygenLicense(licenseId: string): Promise<void> {
  await keygenFetch(`/licenses/${licenseId}/actions/revoke`, {
    method: "POST",
  });
}

export async function listKeygenMachines(licenseId: string): Promise<
  Array<{ id: string; fingerprint: string; name: string | null }>
> {
  const body = await keygenFetch(`/licenses/${licenseId}/machines`);
  const list = Array.isArray(body.data) ? body.data : body.data ? [body.data] : [];
  return list.map((m) => ({
    id: m.id,
    fingerprint: String(m.attributes.fingerprint ?? ""),
    name: (m.attributes.name as string | null) ?? null,
  }));
}

export async function deleteKeygenMachine(machineId: string): Promise<void> {
  await keygenFetch(`/machines/${machineId}`, { method: "DELETE" });
}
