// ---------------------------------------------------------------------------
// Shared email shell
// ---------------------------------------------------------------------------

interface EmailShellProps {
  badge: string;
  children: React.ReactNode;
}

function EmailShell({ badge, children }: EmailShellProps) {
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
                      <table cellPadding={0} cellSpacing={0} width="100%">
                        <tbody>
                          <tr>
                            <td valign="middle">
                              <img
                                src="https://ugle.ai/Ugle%20Logo.png"
                                alt="Ugle"
                                width={90}
                                height={32}
                                style={{ display: "block" }}
                              />
                            </td>
                            <td align="right" valign="middle">
                              <div
                                style={{
                                  display: "inline-block",
                                  backgroundColor: "rgba(117, 192, 67, 0.1)",
                                  border: "1px solid rgba(117, 192, 67, 0.3)",
                                  borderRadius: "6px",
                                  padding: "4px 10px",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#5a9e2f",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase" as const,
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {badge}
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {children}

                  <tr>
                    <td
                      style={{
                        padding: "20px 48px",
                        borderTop: "1px solid #f0f0f0",
                        backgroundColor: "#fafafa",
                        textAlign: "center",
                        borderRadius: "0 0 16px 16px",
                      }}
                    >
                      <p
                        style={{
                          color: "#d4d4d8",
                          fontSize: "12px",
                          fontFamily: "monospace",
                          margin: 0,
                        }}
                      >
                        © 2026 Ugle. All rights reserved.
                      </p>
                    </td>
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

// ---------------------------------------------------------------------------
// Detail row helper
// ---------------------------------------------------------------------------

interface DetailRowProps {
  label: string;
  value: string;
  isLast?: boolean;
  highlight?: boolean;
}

function DetailRow({ label, value, isLast, highlight }: DetailRowProps) {
  return (
    <tr>
      <td
        style={{
          padding: "14px 20px",
          borderBottom: isLast ? "none" : "1px solid #f0f0f0",
        }}
      >
        <table cellPadding={0} cellSpacing={0} width="100%">
          <tbody>
            <tr>
              <td width="160" valign="top">
                <span
                  style={{
                    color: "#a1a1aa",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    fontFamily: "monospace",
                  }}
                >
                  {label}
                </span>
              </td>
              <td>
                <span
                  style={{
                    color: highlight ? "#5a9e2f" : "#52525b",
                    fontSize: "14px",
                    fontWeight: highlight ? 600 : 400,
                    fontFamily: "monospace",
                    lineHeight: "1.5",
                  }}
                >
                  {value}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// EarlyAccessConfirmationEmail — sent to the requester
// ---------------------------------------------------------------------------

export interface EarlyAccessConfirmationEmailProps {
  firstName: string;
  email: string;
  os: string;
}

export function EarlyAccessConfirmationEmail({
  firstName,
  email,
  os,
}: EarlyAccessConfirmationEmailProps) {
  return (
    <EmailShell badge="Early Access">
      {/* Hero */}
      <tr>
        <td style={{ padding: "44px 48px 28px" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(117, 192, 67, 0.1)",
              border: "1px solid rgba(117, 192, 67, 0.35)",
              borderRadius: "6px",
              padding: "4px 12px",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                color: "#5a9e2f",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                fontFamily: "monospace",
              }}
            >
              You&apos;re on the list
            </span>
          </div>

          <h1
            style={{
              color: "#111111",
              fontSize: "28px",
              fontWeight: 700,
              lineHeight: "1.25",
              margin: "0 0 16px 0",
              letterSpacing: "-0.02em",
            }}
          >
            You&apos;re in, {firstName}! Your early access invitation is on its
            way.
          </h1>

          <p
            style={{
              color: "#52525b",
              fontSize: "16px",
              lineHeight: "1.7",
              margin: "0 0 16px 0",
            }}
          >
            We&apos;ve reserved your spot for Ugle on{" "}
            <span style={{ color: "#5a9e2f", fontWeight: 600 }}>{os}</span>.
            We&apos;ll send your download link and activation details to{" "}
            <span style={{ color: "#5a9e2f", fontWeight: 600 }}>{email}</span>{" "}
            as soon as your build is ready.
          </p>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#f0f0f0",
              margin: "0 0 28px 0",
            }}
          />

          {/* What's next */}
          <p
            style={{
              color: "#71717a",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              fontFamily: "monospace",
              margin: "0 0 20px 0",
            }}
          >
            What happens next
          </p>

          {[
            {
              icon: "🏗️",
              title: "We finalise your build",
              desc: `We'll package the ${os} version of Ugle specifically for your machine.`,
            },
            {
              icon: "📬",
              title: "Invitation email",
              desc: "You'll receive a download link and setup guide directly in your inbox.",
            },
            {
              icon: "⚡",
              title: "Instant local search",
              desc: "Find any soundbite or clip in seconds — no uploads, no cloud.",
            },
          ].map((step, i) => (
            <table
              key={i}
              cellPadding={0}
              cellSpacing={0}
              width="100%"
              style={{ marginBottom: "16px" }}
            >
              <tbody>
                <tr>
                  <td width="44" valign="top" style={{ paddingTop: "2px" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: "rgba(117, 192, 67, 0.12)",
                        borderRadius: "8px",
                        fontSize: "16px",
                        textAlign: "center",
                        lineHeight: "32px",
                      }}
                    >
                      {step.icon}
                    </div>
                  </td>
                  <td style={{ paddingLeft: "12px" }}>
                    <span
                      style={{
                        color: "#111111",
                        fontSize: "14px",
                        fontWeight: 600,
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      {step.title}
                    </span>
                    <span
                      style={{
                        color: "#71717a",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {step.desc}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          ))}
        </td>
      </tr>

      {/* CTA */}
      <tr>
        <td style={{ padding: "0 48px 44px" }}>
          <div
            style={{
              backgroundColor: "#f8fdf4",
              border: "1px solid rgba(117, 192, 67, 0.25)",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#52525b",
                fontSize: "14px",
                margin: "0 0 16px 0",
                lineHeight: "1.5",
              }}
            >
              See how Ugle fits into your media workflow.
            </p>
            <a
              href="https://ugle.ai/how-it-works"
              style={{
                display: "inline-block",
                backgroundColor: "#75C043",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
                padding: "12px 28px",
                borderRadius: "8px",
                letterSpacing: "0.01em",
              }}
            >
              See How It Works →
            </a>
          </div>
        </td>
      </tr>
    </EmailShell>
  );
}

// ---------------------------------------------------------------------------
// EarlyAccessAdminNotificationEmail — sent to admin inbox
// ---------------------------------------------------------------------------

export interface EarlyAccessAdminNotificationEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  os: string;
  submittedAt: string;
}

export function EarlyAccessAdminNotificationEmail({
  firstName,
  lastName,
  email,
  phone,
  os,
  submittedAt,
}: EarlyAccessAdminNotificationEmailProps) {
  return (
    <EmailShell badge="Admin Notification">
      <tr>
        <td style={{ padding: "36px 48px 20px" }}>
          <h1
            style={{
              color: "#111111",
              fontSize: "22px",
              fontWeight: 700,
              lineHeight: "1.3",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
            }}
          >
            New early access request
          </h1>
          <p
            style={{
              color: "#71717a",
              fontSize: "14px",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Someone submitted the get-early-access form.
          </p>
        </td>
      </tr>

      {/* Details card */}
      <tr>
        <td style={{ padding: "0 48px 32px" }}>
          <div
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #e4e4e7",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <table cellPadding={0} cellSpacing={0} width="100%">
              <tbody>
                <DetailRow
                  label="Name"
                  value={`${firstName} ${lastName}`}
                  highlight
                />
                <DetailRow label="Email" value={email} highlight />
                <DetailRow label="Phone" value={phone} />
                <DetailRow label="Primary OS" value={os} isLast />
              </tbody>
            </table>
          </div>
        </td>
      </tr>

      {/* Context note */}
      <tr>
        <td style={{ padding: "0 48px 36px" }}>
          <div
            style={{
              height: "1px",
              backgroundColor: "#f0f0f0",
              marginBottom: "16px",
            }}
          />
          <p
            style={{
              color: "#a1a1aa",
              fontSize: "12px",
              fontFamily: "monospace",
              margin: "0 0 6px 0",
            }}
          >
            Submitted: {submittedAt}
          </p>
          <p
            style={{
              color: "#a1a1aa",
              fontSize: "13px",
              margin: 0,
              lineHeight: "1.6",
              fontFamily: "monospace",
            }}
          >
            Automated notification from the Ugle get-early-access form. Reply
            directly to{" "}
            <span style={{ color: "#5a9e2f" }}>{email}</span> to follow up.
          </p>
        </td>
      </tr>
    </EmailShell>
  );
}
