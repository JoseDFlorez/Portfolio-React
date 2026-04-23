import { env, mailConfigured } from "./env.server";
import { log } from "./logger.server";

type SendArgs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type SendResult = { ok: true; id: string; stubbed?: boolean } | { ok: false; error: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(args: SendArgs): Promise<SendResult> {
  if (!mailConfigured) {
    const reason = "missing RESEND_API_KEY / MAIL_FROM / MAIL_TO";
    log.warn("mail.stubbed", {
      reason,
      name: args.name,
      email: args.email,
      subject: args.subject,
    });
    if (env.NODE_ENV === "production") {
      return { ok: false, error: reason };
    }
    return { ok: true, id: "stubbed", stubbed: true };
  }

  const plain = `From: ${args.name} <${args.email}>\nSubject: ${args.subject}\n\n${args.message}`;
  const html = `
    <p><strong>From:</strong> ${escapeHtml(args.name)} &lt;${escapeHtml(args.email)}&gt;</p>
    <p><strong>Subject:</strong> ${escapeHtml(args.subject)}</p>
    <hr/>
    <p style="white-space:pre-wrap">${escapeHtml(args.message)}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: env.MAIL_TO,
        reply_to: args.email,
        subject: `[portfolio] ${args.subject}`,
        text: plain,
        html,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      log.error("mail.send_failed", { status: res.status, errorBody });
      return { ok: false, error: `Resend returned ${res.status}` };
    }

    const payload = (await res.json()) as { id?: string };
    const id = payload.id ?? "unknown";
    log.info("mail.sent", { id });
    return { ok: true, id };
  } catch (err) {
    log.error("mail.send_exception", { error: String(err) });
    return { ok: false, error: "Network error" };
  }
}
