// Mailjet transactional email. Credentials come from env:
//   MAILJET_API_KEY, MAILJET_SECRET_KEY, MAILJET_FROM_EMAIL, MAILJET_FROM_NAME
//   ALERT_EMAIL (low-stock alerts; defaults to anna@yourself.health)

const MAILJET_ENDPOINT = 'https://api.mailjet.com/v3.1/send'
// Voucher email Mailjet template — managed in Mailjet dashboard.
// Variables expected by template: voucher_code (string), value (number).
const VOUCHER_TEMPLATE_ID = 8037019

function creds() {
  const apiKey = process.env.MAILJET_API_KEY
  const secret = process.env.MAILJET_SECRET_KEY
  const fromEmail = process.env.MAILJET_FROM_EMAIL
  const fromName = process.env.MAILJET_FROM_NAME || 'Health Yourself'
  if (!apiKey || !secret || !fromEmail) return null
  return { apiKey, secret, fromEmail, fromName }
}

async function send(payload: unknown): Promise<boolean> {
  const c = creds()
  if (!c) {
    console.error('Mailjet env vars missing — cannot send email')
    return false
  }
  try {
    const res = await fetch(MAILJET_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' + Buffer.from(`${c.apiKey}:${c.secret}`).toString('base64'),
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error('Mailjet send failed', res.status, await res.text())
      return false
    }
    return true
  } catch (e) {
    console.error('Mailjet send threw', e)
    return false
  }
}

export async function sendVoucherEmail(opts: {
  to: string
  code: string
  voucherValueChf: number
  companyName: string
}): Promise<boolean> {
  const c = creds()
  if (!c) return false
  return send({
    Messages: [
      {
        From: { Email: c.fromEmail, Name: c.fromName },
        To: [{ Email: opts.to }],
        TemplateID: VOUCHER_TEMPLATE_ID,
        TemplateLanguage: true,
        Variables: {
          voucher_code: opts.code,
          value: opts.voucherValueChf,
        },
      },
    ],
  })
}

export async function sendLowStockAlert(opts: {
  companyName: string
  slug: string
  remaining: number
}): Promise<boolean> {
  const c = creds()
  if (!c) return false
  const alertTo = process.env.ALERT_EMAIL || 'anna@yourself.health'
  return send({
    Messages: [
      {
        From: { Email: c.fromEmail, Name: c.fromName },
        To: [{ Email: alertTo }],
        Subject: `Low voucher stock: ${opts.companyName} (${opts.remaining} left)`,
        TextPart: `${opts.companyName} (/${opts.slug}) has only ${opts.remaining} voucher code(s) left to issue. Import more codes before they run out.`,
      },
    ],
  })
}
