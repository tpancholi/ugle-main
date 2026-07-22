/**
 * Blocks known disposable / temporary email domains so trial requests
 * never reach support. Matching is by exact domain or parent domain
 * (e.g. foo.mailinator.com → mailinator.com).
 *
 * This is a curated high-signal list, not exhaustive. Refresh periodically
 * or swap to a maintained package/API if abuse volume grows.
 */

const DISPOSABLE_DOMAINS = new Set(
  [
    // Major temp-mail providers
    "0-mail.com",
    "10minutemail.com",
    "10minutemail.net",
    "10minmail.com",
    "20minutemail.com",
    "33mail.com",
    "guerrillamail.com",
    "guerrillamail.net",
    "guerrillamail.org",
    "guerrillamailblock.com",
    "sharklasers.com",
    "grr.la",
    "guerrillamail.de",
    "mailinator.com",
    "mailinator.net",
    "mailinator2.com",
    "mailinator.org",
    "maildrop.cc",
    "mailnesia.com",
    "mailnull.com",
    "mailcatch.com",
    "mailtemp.info",
    "mail-temporaire.fr",
    "tempmail.com",
    "temp-mail.org",
    "temp-mail.io",
    "tempmailo.com",
    "tempail.com",
    "tempr.email",
    "discard.email",
    "discardmail.com",
    "throwaway.email",
    "throwawaymail.com",
    "trashmail.com",
    "trashmail.me",
    "trashmail.net",
    "trash-mail.com",
    "yopmail.com",
    "yopmail.fr",
    "yopmail.net",
    "cool.fr.nf",
    "jetable.org",
    "nospam.ze.tc",
    "nomail.xl.cx",
    "mega.zik.dj",
    "speed.1s.fr",
    "courriel.fr.nf",
    "moncourrier.fr.nf",
    "monemail.fr.nf",
    "monmail.fr.nf",
    "getnada.com",
    "nada.email",
    "emailondeck.com",
    "fakeinbox.com",
    "fakemailgenerator.com",
    "getairmail.com",
    "inboxkitten.com",
    "moakt.com",
    "mohmal.com",
    "mytemp.email",
    "tempinbox.com",
    "tmpmail.org",
    "tmpmail.net",
    "dispostable.com",
    "spamgourmet.com",
    "spam4.me",
    "mailforspam.com",
    "mintemail.com",
    "mt2009.com",
    "mt2014.com",
    "thankyou2010.com",
    "trash2009.com",
    "meltmail.com",
    "mailscrap.com",
    "emailtemporanea.com",
    "emailtemporanea.net",
    "temprmail.com",
    "tmpbox.net",
    "mailpoof.com",
    "burnermail.io",
    "guerrillamail.info",
    "pokemail.net",
    "spamfree24.org",
    "spamfree24.de",
    "spamfree24.eu",
    "spamfree24.net",
    "spamfree24.com",
    "wegwerfmail.de",
    "wegwerfmail.net",
    "wegwerfmail.org",
    "einrot.com",
    "armyspy.com",
    "cuvox.de",
    "dayrep.com",
    "fleckens.hu",
    "gustr.com",
    "jourrapide.com",
    "rhyta.com",
    "superrito.com",
    "teleworm.us",
    // Catch-all style / abuse-prone
    "mail.tm",
    "mail.gw",
    "emailfake.com",
    "generator.email",
    "crazymailing.com",
    "tempmailaddress.com",
    "temporary-mail.net",
    "tmpeml.com",
    "dropmail.me",
    "emkei.cz",
    "harakirimail.com",
    "mailzilla.com",
    "spamobox.com",
    "trashymail.com",
    "mailimate.com",
    "mailexpire.com",
    "tempomail.fr",
  ].map((d) => d.toLowerCase()),
);

export const DISPOSABLE_EMAIL_MESSAGE =
  "Please use a permanent email address. Temporary or disposable addresses are not accepted for trials.";

/** Extract domain from an email; returns null if malformed. */
export function emailDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return null;
  return email.slice(at + 1).trim().toLowerCase();
}

/**
 * True if the email's domain (or any parent domain) is on the disposable list.
 * `user@a.b.mailinator.com` matches `mailinator.com`.
 */
export function isDisposableEmail(email: string): boolean {
  const domain = emailDomain(email.trim().toLowerCase());
  if (!domain) return false;

  if (DISPOSABLE_DOMAINS.has(domain)) return true;

  const parts = domain.split(".");
  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join(".");
    if (DISPOSABLE_DOMAINS.has(parent)) return true;
  }
  return false;
}
