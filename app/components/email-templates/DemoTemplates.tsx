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
                  {/* Green accent top bar */}
                  <tr>
                    <td style={{ height: "4px", backgroundColor: "#75C043" }} />
                  </tr>

                  {/* Logo + badge row */}
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

                  {/* Body */}
                  {children}

                  {/* Footer */}
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
// Detail row helper used inside the data card
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
// DemoConfirmationEmail  — sent to the person who requested a demo
// ---------------------------------------------------------------------------

export interface DemoConfirmationEmailProps {
  firstName: string;
  email: string;
}

export function DemoConfirmationEmail({
  firstName,
  email,
}: DemoConfirmationEmailProps) {
  return (
    <EmailShell badge="Demo Request">
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
              Request received
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
            Thanks, {firstName}! We&apos;ll be in touch soon.
          </h1>

          <p
            style={{
              color: "#52525b",
              fontSize: "16px",
              lineHeight: "1.7",
              margin: "0 0 32px 0",
            }}
          >
            Our enterprise team has received your demo request and will reach
            out to{" "}
            <span style={{ color: "#5a9e2f", fontWeight: 600 }}>{email}</span>{" "}
            within 1 business day to schedule a session tailored to your team.
          </p>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#f0f0f0",
              margin: "0 0 28px 0",
            }}
          />

          {/* What happens next */}
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

          {/* Steps */}
          {[
            {
              icon: "📅",
              title: "We'll schedule a call",
              desc: "Our team will find a time that works for you.",
            },
            {
              icon: "🎬",
              title: "Personalised walkthrough",
              desc: "We'll demo Ugle using your team's real workflows.",
            },
            {
              icon: "🚀",
              title: "Start your trial",
              desc: "Get hands-on access to see the speed for yourself.",
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
              While you wait, explore how Ugle works for media teams.
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
// DemoAdminNotificationEmail  — sent to the admin inbox
// ---------------------------------------------------------------------------

export interface DemoAdminNotificationEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  teamSize: string;
  currentSearch: string;
  submittedAt: string;
}

export function DemoAdminNotificationEmail({
  firstName,
  lastName,
  email,
  company,
  teamSize,
  currentSearch,
  submittedAt,
}: DemoAdminNotificationEmailProps) {
  return (
    <EmailShell badge="Admin Notification">
      {/* Title */}
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
            New demo request
          </h1>
          <p
            style={{
              color: "#71717a",
              fontSize: "14px",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Someone submitted the request-demo form.
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
                <DetailRow label="Company" value={company} />
                <DetailRow label="Team size" value={teamSize} />
                <DetailRow
                  label="Archive search"
                  value={currentSearch}
                  isLast
                />
              </tbody>
            </table>
          </div>
        </td>
      </tr>

      {/* Submitted at + context note */}
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
            Automated notification from the Ugle request-demo form. Reply
            directly to{" "}
            <span style={{ color: "#5a9e2f" }}>{email}</span> to follow up.
          </p>
        </td>
      </tr>
    </EmailShell>
  );
}
