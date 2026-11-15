# Production Deployment Guide

CareCircle AI is optimized for instant deployment to Vercel and Supabase.

## Deploying to Vercel

1. Push code to GitHub repository: `https://github.com/Aman-Goswami2510/CareCircle-AI`
2. Go to [https://vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework Preset: **Next.js**
4. Root Directory: `./`
5. Configure Environment Variables:
   - `CRON_SECRET`: Secure cron token string
   - `RESEND_API_KEY`: (Optional) Your Resend API Key for live transactional email delivery
   - `NEXT_PUBLIC_APP_URL`: Your deployed production URL
6. Click **Deploy**.

