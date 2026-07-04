interface NewsletterAdminNotificationEmailProps {
  subscriberEmail: string;
  subscribedAt: string;
}

export function NewsletterAdminNotificationEmail({
  subscriberEmail,
  subscribedAt,
}: NewsletterAdminNotificationEmailProps) {
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
              {/* Card */}
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
                    <td
                      style={{
                        height: "4px",
                        backgroundColor: "#75C043",
                      }}
                    />
                  </tr>

                  {/* Logo + admin badge row */}
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
                              {/* Dark logo — visible on white background */}
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
                                  Admin Notification
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

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
                        New newsletter subscriber
                      </h1>
                      <p
                        style={{
                          color: "#71717a",
                          fontSize: "14px",
                          margin: 0,
                          lineHeight: "1.5",
                        }}
                      >
                        Someone just joined the Ugle mailing list.
                      </p>
                    </td>
                  </tr>

                  {/* Subscriber details card */}
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
                            {/* Email row */}
                            <tr>
                              <td
                                style={{
                                  padding: "16px 20px",
                                  borderBottom: "1px solid #f0f0f0",
                                }}
                              >
                                <table
                                  cellPadding={0}
                                  cellSpacing={0}
                                  width="100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td width="130">
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
                                          Email
                                        </span>
                                      </td>
                                      <td>
                                        <span
                                          style={{
                                            color: "#5a9e2f",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            fontFamily: "monospace",
                                          }}
                                        >
                                          {subscriberEmail}
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            {/* Subscribed at row */}
                            <tr>
                              <td style={{ padding: "16px 20px" }}>
                                <table
                                  cellPadding={0}
                                  cellSpacing={0}
                                  width="100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td width="130">
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
                                          Subscribed at
                                        </span>
                                      </td>
                                      <td>
                                        <span
                                          style={{
                                            color: "#52525b",
                                            fontSize: "14px",
                                            fontFamily: "monospace",
                                          }}
                                        >
                                          {subscribedAt}
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
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
                          marginBottom: "20px",
                        }}
                      />
                      <p
                        style={{
                          color: "#a1a1aa",
                          fontSize: "13px",
                          margin: 0,
                          lineHeight: "1.6",
                          fontFamily: "monospace",
                        }}
                      >
                        This is an automated notification from the Ugle website
                        newsletter form. No action is required.
                      </p>
                    </td>
                  </tr>

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
                        © 2026 Ugle. Internal notification — do not reply.
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

interface NewsletterWelcomeEmailProps {
  email: string;
}

export function NewsletterWelcomeEmail({ email }: NewsletterWelcomeEmailProps) {
  return (
    <div
      style={{
        backgroundColor: "#f4f4f5",
        fontFamily: "'Manrope', 'Helvetica Neue', Arial, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Outer wrapper */}
      <table
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        style={{ backgroundColor: "#f4f4f5", padding: "40px 16px" }}
      >
        <tbody>
          <tr>
            <td align="center">
              {/* Card */}
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
                    <td
                      style={{
                        height: "4px",
                        backgroundColor: "#75C043",
                      }}
                    />
                  </tr>

                  {/* Logo section */}
                  <tr>
                    <td
                      style={{
                        padding: "36px 48px 28px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {/* Dark logo — visible on white background */}
                      <img
                        src="https://ugle.ai/Ugle%20Logo.png"
                        alt="Ugle"
                        width={110}
                        height={40}
                        style={{ display: "block" }}
                      />
                    </td>
                  </tr>

                  {/* Hero section */}
                  <tr>
                    <td style={{ padding: "44px 48px 28px" }}>
                      {/* Badge */}
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
                          You&apos;re in
                        </span>
                      </div>

                      <h1
                        style={{
                          color: "#111111",
                          fontSize: "30px",
                          fontWeight: 700,
                          lineHeight: "1.2",
                          margin: "0 0 16px 0",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        Welcome to the{" "}
                        <span style={{ color: "#5a9e2f" }}>Ugle</span> community
                      </h1>

                      <p
                        style={{
                          color: "#52525b",
                          fontSize: "16px",
                          lineHeight: "1.7",
                          margin: "0 0 32px 0",
                        }}
                      >
                        You&apos;ve joined a growing community of media
                        professionals who believe search should be instant,
                        local, and private. We&apos;ll keep you updated on new
                        features, early access opportunities, and tips to master
                        your workflow.
                      </p>

                      {/* Divider */}
                      <div
                        style={{
                          height: "1px",
                          backgroundColor: "#f0f0f0",
                          margin: "0 0 28px 0",
                        }}
                      />

                      {/* What to expect label */}
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
                        What to expect
                      </p>

                      {/* Feature: Early access */}
                      <table
                        cellPadding={0}
                        cellSpacing={0}
                        width="100%"
                        style={{ marginBottom: "16px" }}
                      >
                        <tbody>
                          <tr>
                            <td
                              width="44"
                              valign="top"
                              style={{ paddingTop: "2px" }}
                            >
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
                                ⚡
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
                                Early access
                              </span>
                              <span
                                style={{
                                  color: "#71717a",
                                  fontSize: "14px",
                                  lineHeight: "1.5",
                                }}
                              >
                                Be first in line when new features ship.
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Feature: Pro tips */}
                      <table
                        cellPadding={0}
                        cellSpacing={0}
                        width="100%"
                        style={{ marginBottom: "16px" }}
                      >
                        <tbody>
                          <tr>
                            <td
                              width="44"
                              valign="top"
                              style={{ paddingTop: "2px" }}
                            >
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
                                🎬
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
                                Pro tips
                              </span>
                              <span
                                style={{
                                  color: "#71717a",
                                  fontSize: "14px",
                                  lineHeight: "1.5",
                                }}
                              >
                                Workflows and shortcuts for media professionals.
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Feature: Privacy */}
                      <table
                        cellPadding={0}
                        cellSpacing={0}
                        width="100%"
                        style={{ marginBottom: "0" }}
                      >
                        <tbody>
                          <tr>
                            <td
                              width="44"
                              valign="top"
                              style={{ paddingTop: "2px" }}
                            >
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
                                🔒
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
                                Privacy-first updates
                              </span>
                              <span
                                style={{
                                  color: "#71717a",
                                  fontSize: "14px",
                                  lineHeight: "1.5",
                                }}
                              >
                                See how we keep your data local and secure.
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* CTA block */}
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
                          Ready to experience local-first media search?
                        </p>
                        <a
                          href="https://ugle.ai/download"
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
                          Get Early Access →
                        </a>
                      </div>
                    </td>
                  </tr>

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
                          color: "#a1a1aa",
                          fontSize: "12px",
                          fontFamily: "monospace",
                          margin: "0 0 6px 0",
                          lineHeight: "1.5",
                        }}
                      >
                        You&apos;re receiving this because{" "}
                        <span style={{ color: "#5a9e2f" }}>{email}</span>{" "}
                        subscribed to Ugle updates.
                      </p>
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
