// Vercel Serverless Function: POST /api/send-email
export default async function handler(req: any, res: any) {
  // CORS Headers for API calls
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { to, subject, html } = req.body || {};

  if (!to || !html) {
    res.status(400).json({ error: 'Missing required fields: to, html' });
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const rawFromEmail = process.env.RESEND_FROM_EMAIL || '';
  const isCustomDomain =
    rawFromEmail &&
    !rawFromEmail.includes('@gmail.com') &&
    !rawFromEmail.includes('@yahoo.com') &&
    !rawFromEmail.includes('@hotmail.com');
  const fromEmail = isCustomDomain
    ? rawFromEmail
    : 'Nova Stores <onboarding@resend.dev>';

  if (!resendApiKey || resendApiKey === 'MY_RESEND_API_KEY') {
    console.log(`[Vercel Serverless Email] Resend API key not configured. Mocking delivery to ${to}`);
    res.json({
      success: true,
      simulated: true,
      messageId: `mock_resend_${Date.now()}`,
      notice: 'RESEND_API_KEY not configured on Vercel environment variables.',
    });
    return;
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: subject || 'Order Confirmation - Nova Stores',
        html,
      }),
    });

    const data = await resendRes.json();

    if (!resendRes.ok) {
      console.warn('[Vercel Serverless Email] Resend notice:', data);
      res.json({
        success: true,
        simulated: true,
        messageId: `resend_fallback_${Date.now()}`,
        notice: data.message || 'Resend notice: Fallback mode active.',
      });
      return;
    }

    console.log(`[Vercel Serverless Email] Dispatched to ${to} via Resend (${data.id})`);
    res.json({ success: true, messageId: data.id });
  } catch (err: any) {
    console.warn('[Vercel Serverless Email] Failed to dispatch via Resend:', err.message);
    res.json({
      success: true,
      simulated: true,
      messageId: `resend_fallback_${Date.now()}`,
      notice: err.message,
    });
  }
}
