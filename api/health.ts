// Vercel Serverless Function: GET /api/health
export default function handler(_req: any, res: any) {
  res.json({
    status: 'healthy',
    platform: 'vercel',
    timestamp: new Date().toISOString(),
    environment: {
      supabase_configured: Boolean(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL),
      resend_configured: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'MY_RESEND_API_KEY'),
    },
  });
}
