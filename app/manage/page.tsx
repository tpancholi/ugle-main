import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDb } from "@/app/lib/db";
import { customers } from "@/app/lib/db/schema";
import { databaseConfig } from "@/app/lib/env";
import { getLatestLicenseForCustomer } from "@/app/lib/licensing/fulfill";
import { verifyManageJwt } from "@/app/lib/manage-token";
import { PLAN_LABEL, formatInr, planPricing } from "@/app/lib/pricing";
import { ManageClient } from "./ManageClient";

export default async function ManagePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full space-y-4">
          <h1 className="text-2xl font-extrabold text-ugle-slate">
            Manage your licence
          </h1>
          <p className="text-ugle-gray text-[15px]">
            Enter the email you used at checkout or trial signup. We’ll send a
            fresh manage link.
          </p>
          <ManageClient mode="request" />
          <p className="text-[13px] text-ugle-gray/70">
            Or email{" "}
            <a
              href="mailto:support@ugle.ai"
              className="text-[#5DA233] font-semibold"
            >
              support@ugle.ai
            </a>
          </p>
        </div>
      </main>
    );
  }

  if (!databaseConfig.success) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-6">
        <p className="text-ugle-gray">Licensing is temporarily unavailable.</p>
      </main>
    );
  }

  const session = await verifyManageJwt(token);
  if (!session) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-6 py-24">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-extrabold text-ugle-slate">
            Link expired
          </h1>
          <p className="text-ugle-gray">
            This manage link is invalid or expired. Request a new one below.
          </p>
          <ManageClient mode="request" />
        </div>
      </main>
    );
  }

  const db = getDb();
  const [[customer], license] = await Promise.all([
    db
      .select()
      .from(customers)
      .where(eq(customers.id, session.customerId))
      .limit(1),
    getLatestLicenseForCustomer(session.customerId),
  ]);

  if (!customer || !license) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-6">
        <p className="text-ugle-gray">No licence found for this link.</p>
      </main>
    );
  }

  const expiry = license.expiresAt
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeZone: "Asia/Kolkata",
      }).format(license.expiresAt)
    : "—";

  const renewPlan =
    license.plan === "monthly" || license.plan === "annual"
      ? license.plan
      : "annual";
  const renewPricing = planPricing(renewPlan);

  return (
    <main className="min-h-[70vh] px-6 py-24">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#5DA233] mb-2">
            Licence
          </div>
          <h1 className="text-3xl font-extrabold text-ugle-slate tracking-tight">
            Manage licence
          </h1>
          <p className="text-ugle-gray mt-1">{customer.email}</p>
        </div>

        <div className="bg-white border border-ugle-light/60 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-ugle-gray text-[12px]">Plan</div>
              <div className="font-semibold text-ugle-slate">
                {PLAN_LABEL[license.plan]}
              </div>
            </div>
            <div>
              <div className="text-ugle-gray text-[12px]">Status</div>
              <div className="font-semibold text-ugle-slate capitalize">
                {license.status}
                {license.cancelAtPeriodEnd ? " · ends at period" : ""}
              </div>
            </div>
            <div>
              <div className="text-ugle-gray text-[12px]">Valid until</div>
              <div className="font-semibold text-ugle-slate">{expiry}</div>
            </div>
            <div>
              <div className="text-ugle-gray text-[12px]">Machines</div>
              <div className="font-semibold text-ugle-slate">
                2 node-locked (transfers via support)
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#F8FAF9] border border-ugle-light/70 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ugle-gray mb-1">
              Licence key
            </div>
            <code className="text-sm break-all text-ugle-slate">
              {license.keygenLicenseKey}
            </code>
          </div>
        </div>

        <div className="bg-white border border-ugle-light/60 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-ugle-slate">Renew</h2>
          <p className="text-[14px] text-ugle-gray">
            Extend the same key for another{" "}
            {renewPlan === "annual" ? "year" : "month"}. Total{" "}
            {formatInr(renewPricing.total)} incl. GST.
          </p>
          <Link
            href={`/pricing#checkout`}
            className="inline-flex px-5 py-2.5 bg-ugle-slate text-white text-sm font-bold rounded-[10px]"
          >
            Renew on pricing page
          </Link>
          <p className="text-[12.5px] text-ugle-gray/70">
            Use the same email ({customer.email}) at checkout so we extend this
            licence.
          </p>
        </div>

        <div className="bg-white border border-ugle-light/60 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-ugle-slate">Cancel renewal</h2>
          <p className="text-[14px] text-ugle-gray">
            Stops renewal reminders. You keep access until {expiry}.
          </p>
          <ManageClient mode="cancel" token={token} />
        </div>

        <p className="text-[13px] text-ugle-gray">
          Need a machine transfer or refund?{" "}
          <a
            href="mailto:support@ugle.ai"
            className="text-[#5DA233] font-semibold"
          >
            support@ugle.ai
          </a>
        </p>
      </div>
    </main>
  );
}
