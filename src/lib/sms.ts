// src/lib/sms.ts
// TODO: connect your SMS gateway. Until you do, password-reset codes are NOT delivered.
export async function sendSms(to: string, message: string): Promise<void> {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[SMS stub] to=${to} msg=${message}`)
    return
  }
  const url = process.env.SMS_API_URL
  const key = process.env.SMS_API_KEY
  if (!url || !key) {
    console.error('[SMS] SMS_API_URL / SMS_API_KEY not configured; message not sent')
    return
  }
  // Adapt this request to your provider's API format:
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ to, message }),
  })
  if (!res.ok) console.error('[SMS] provider error', res.status)
}
