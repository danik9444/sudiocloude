interface SendMessageParams {
  phone: string
  message: string
}

interface SendMessageResponse {
  idMessage: string
  statusMessage?: string
}

/**
 * Send WhatsApp message via Green API
 */
export async function sendWhatsAppMessage({
  phone,
  message,
}: SendMessageParams): Promise<SendMessageResponse> {
  const url = `${process.env.GREEN_API_URL}/waInstance${process.env.GREEN_API_INSTANCE_ID}/sendMessage/${process.env.GREEN_API_TOKEN}`

  // Clean phone number (remove non-digits)
  const cleanPhone = phone.replace(/\D/g, '')

  // Format for Green API (add @c.us)
  const chatId = `${cleanPhone}@c.us`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId,
      message,
    }),
  })

  if (!response.ok) {
    throw new Error(`Green API error: ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Format WhatsApp message for new project
 */
export function formatProjectNotification(
  projectName: string,
  eventDate: string,
  shareLink: string
): string {
  return `
🎬 פרויקט חדש מוכן לעבודה!

📅 שם: ${projectName}
📆 תאריך: ${eventDate}

🔗 קישור לתיקייה:
${shareLink}

ניתן לשלוח קישור זה לצלם שלך.
  `.trim()
}

/**
 * Check Green API instance status
 */
export async function checkInstanceStatus(): Promise<{
  stateInstance: string
}> {
  const url = `${process.env.GREEN_API_URL}/waInstance${process.env.GREEN_API_INSTANCE_ID}/getStateInstance/${process.env.GREEN_API_TOKEN}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Green API error: ${response.statusText}`)
  }

  return await response.json()
}
