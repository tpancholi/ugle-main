import * as React from "react";
import { PLAN_LABEL, formatInr } from "@/app/lib/pricing";

function EmailShell({
  badge,
  children,
}: {
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "#f4f4f5",
        fontFamily: "'Manrope', 'Helvetica Neue', Arial, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      <table
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        style={{ backgroundColor: "#f4f4f5", padding: "40px 16px" }}
      >
        <tbody>
          <tr>
            <td align="center">
              <table
                width="600"
                cellPadding={0}
                cellSpacing={0}
                style={{
                  maxWidth: "600px",
                  width: "100%",
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid #e4e4e7",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ height: "4px", backgroundColor: "#75C043" }} />
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "28px 48px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <img
                        src="https://ugle.ai/Ugle%20Logo.png"
                        alt="Ugle"
                        width={90}
                        height={28}
                        style={{ display: "block" }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#5DA233",
                          fontWeight: 700,
                        }}
                      >
                        {badge}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "32px 48px" }}>{children}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function LicenseDeliveryEmail({
  name,
  email,
  plan,
  licenseKey,
  expiresAt,
  manageUrl,
  amountTotalInr,
  downloadUrl,
}: {
  name?: string;
  email: string;
  plan: "trial" | "monthly" | "annual";
  licenseKey: string;
  expiresAt: string | null;
  manageUrl: string;
  amountTotalInr?: number;
  downloadUrl: string;
}) {
  const greeting = name ? `Hi ${name},` : "Hi,";
  const expiryLabel = expiresAt
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeZone: "Asia/Kolkata",
      }).format(new Date(expiresAt))
    : null;

  return (
    <EmailShell badge={plan === "trial" ? "Trial licence" : "Licence"}>
      <p style={{ fontSize: "16px", color: "#18181b", margin: "0 0 16px" }}>
        {greeting}
      </p>
      <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.6 }}>
        {plan === "trial"
          ? "Your 15-day Ugle trial is ready. Activate with the licence key below on up to 2 machines."
          : `Thanks for purchasing ${PLAN_LABEL[plan]}. Your licence key is below.`}
      </p>

      <div
        style={{
          margin: "24px 0",
          padding: "16px 20px",
          backgroundColor: "#F8FAF9",
          borderRadius: "12px",
          border: "1px solid #e4e4e7",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#71717a",
            marginBottom: "6px",
            fontWeight: 600,
          }}
        >
          Licence key
        </div>
        <div
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "15px",
            color: "#18181b",
            wordBreak: "break-all",
          }}
        >
          {licenseKey}
        </div>
        {expiryLabel && (
          <div style={{ marginTop: "10px", fontSize: "13px", color: "#52525b" }}>
            Valid until {expiryLabel}
          </div>
        )}
        {amountTotalInr != null && plan !== "trial" && (
          <div style={{ marginTop: "6px", fontSize: "13px", color: "#52525b" }}>
            Amount paid: {formatInr(amountTotalInr)} (incl. GST)
          </div>
        )}
      </div>

      <p style={{ fontSize: "14px", color: "#3f3f46", lineHeight: 1.6 }}>
        Sent to {email}. Download the app, then activate in Settings → Licence.
      </p>

      <table cellPadding={0} cellSpacing={0} style={{ margin: "28px 0 12px" }}>
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: "10px",
                padding: "12px 22px",
              }}
            >
              <a
                href={downloadUrl}
                style={{
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                Download Ugle →
              </a>
            </td>
            <td width={12} />
            <td
              style={{
                backgroundColor: "#75C043",
                borderRadius: "10px",
                padding: "12px 22px",
              }}
            >
              <a
                href={manageUrl}
                style={{
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                Manage licence →
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: "13px", color: "#71717a", lineHeight: 1.5 }}>
        Machine transfers are handled by support for now — email support@ugle.ai
        if you need to move a seat.
      </p>
    </EmailShell>
  );
}

export function PaymentSupportAlertEmail({
  kind,
  email,
  plan,
  details,
}: {
  kind: "success" | "failed" | "dropped" | "stuck" | "refund";
  email: string;
  plan: string;
  details: string;
}) {
  return (
    <EmailShell badge={`Payment ${kind}`}>
      <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.6 }}>
        <strong>Customer:</strong> {email}
        <br />
        <strong>Plan:</strong> {plan}
        <br />
        <strong>Details:</strong> {details}
      </p>
    </EmailShell>
  );
}
