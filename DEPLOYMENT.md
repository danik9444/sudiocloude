# Studio Cloud - Deployment Guide

## מבוא
מדריך זה מסביר כיצד להעלות ולהפעיל את מערכת Studio Cloud בסביבת ייצור.

## תוכן עניינים
1. [דרישות מקדימות](#דרישות-מקדימות)
2. [הגדרת Supabase](#הגדרת-supabase)
3. [הגדרת Backblaze B2](#הגדרת-backblaze-b2)
4. [הגדרת Cloudflare](#הגדרת-cloudflare)
5. [הגדרת Green API (WhatsApp)](#הגדרת-green-api)
6. [Deploy ל-Vercel](#deploy-לvercel)
7. [Supabase Edge Functions](#supabase-edge-functions)

## דרישות מקדימות

- חשבון GitHub
- חשבון Vercel
- חשבון Supabase
- חשבון Backblaze B2
- חשבון Cloudflare
- חשבון Green API
- Node.js 18+ מותקן מקומית

## הגדרת Supabase

### 1. צור פרויקט חדש
1. היכנס ל-[Supabase Dashboard](https://supabase.com/dashboard)
2. לחץ על "New Project"
3. בחר ארגון ושם לפרויקט
4. בחר region קרוב (Frankfurt מומלץ)
5. בחר סיסמת Database חזקה ושמור אותה

### 2. הרץ את ה-SQL Schema
1. פתח את SQL Editor בסיידבר
2. העתק את התוכן מקובץ `supabase/schema.sql`
3. הרץ את הסקריפט
4. וודא שכל הטבלאות נוצרו ב-Database

### 3. שמור את המפתחות
1. לך ל-Settings > API
2. שמור את:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - service_role key (SUPABASE_SERVICE_ROLE_KEY)

## הגדרת Backblaze B2

### 1. צור Bucket
1. היכנס ל-[Backblaze B2 Console](https://www.backblaze.com/b2)
2. לחץ על "Create a Bucket"
3. הגדרות:
   - Bucket Name: `studio-cloud-files`
   - Files in Bucket: Public
   - Object Lock: Disabled
   - Encryption: Disabled

### 2. צור Application Key
1. לחץ על "App Keys" בסיידבר
2. לחץ על "Add a New Application Key"
3. הגדרות:
   - Name: `studio-cloud-key`
   - Allow access to bucket: בחר את הbucket שיצרת
   - Type: Read and Write
   - Allow List All: כן
4. שמור את:
   - keyID (B2_KEY_ID)
   - applicationKey (B2_APPLICATION_KEY)
   - Endpoint URL (B2_ENDPOINT)

## הגדרת Cloudflare

### 1. הוסף Domain
1. היכנס ל-[Cloudflare Dashboard](https://dash.cloudflare.com)
2. Add Site
3. עקוב אחרי ההוראות להעברת DNS

### 2. צור CNAME Record
1. לך ל-DNS Settings
2. Add Record:
   - Type: CNAME
   - Name: `files` (או `cdn`)
   - Target: `f004.backblazeb2.com` (תלוי בregion שלך ב-B2)
   - Proxy status: Proxied (ענן כתום)

### 3. הגדר Bucket ב-B2
1. חזור ל-Backblaze B2
2. לחץ על הbucket
3. Bucket Settings > Add Custom Domain
4. Domain: `files.yourdomain.com`

### 4. צור Page Rule (אופציונלי)
1. ב-Cloudflare: Rules > Page Rules
2. Create Page Rule:
   - URL: `files.yourdomain.com/*`
   - Settings:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 1 month

## הגדרת Green API

### 1. צור Instance
1. היכנס ל-[Green API](https://green-api.com)
2. צור instance חדש
3. סרוק QR code עם WhatsApp

### 2. שמור מפתחות
- Instance ID (GREEN_API_INSTANCE_ID)
- Token (GREEN_API_TOKEN)

## Deploy ל-Vercel

### 1. Push לGitHub
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
\`\`\`

### 2. Import לVercel
1. היכנס ל-[Vercel Dashboard](https://vercel.com)
2. New Project
3. Import מGitHub
4. בחר את הרפוזיטורי

### 3. הגדר Environment Variables
הוסף את כל המשתנים מ-`.env.example`:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
B2_ENDPOINT=...
B2_REGION=...
B2_BUCKET_NAME=...
B2_KEY_ID=...
B2_APPLICATION_KEY=...
CDN_DOMAIN=...
GREEN_API_INSTANCE_ID=...
GREEN_API_TOKEN=...
GREEN_API_URL=https://api.green-api.com
NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
NEXT_PUBLIC_APP_NAME=סטודיו קלאוד
\`\`\`

### 4. Deploy
לחץ על Deploy ו-Vercel יבנה את הפרויקט!

## Supabase Edge Functions

### 1. התקן Supabase CLI
\`\`\`bash
npm install -g supabase
\`\`\`

### 2. Login לSupabase
\`\`\`bash
supabase login
\`\`\`

### 3. Link לפרויקט
\`\`\`bash
supabase link --project-ref YOUR_PROJECT_REF
\`\`\`

### 4. Deploy Edge Functions
\`\`\`bash
cd supabase/functions
supabase functions deploy create-project
supabase functions deploy get-upload-url
supabase functions deploy get-download-url
supabase functions deploy send-whatsapp
supabase functions deploy auto-move-projects
\`\`\`

### 5. הגדר Secrets
\`\`\`bash
supabase secrets set B2_ENDPOINT=YOUR_VALUE
supabase secrets set B2_REGION=YOUR_VALUE
supabase secrets set B2_BUCKET_NAME=YOUR_VALUE
supabase secrets set B2_KEY_ID=YOUR_VALUE
supabase secrets set B2_APPLICATION_KEY=YOUR_VALUE
supabase secrets set GREEN_API_INSTANCE_ID=YOUR_VALUE
supabase secrets set GREEN_API_TOKEN=YOUR_VALUE
supabase secrets set GREEN_API_URL=https://api.green-api.com
supabase secrets set CDN_DOMAIN=YOUR_VALUE
supabase secrets set APP_URL=YOUR_VALUE
\`\`\`

### 6. הגדר Cron Job
1. פתח SQL Editor בSupabase
2. הרץ:

\`\`\`sql
SELECT cron.schedule(
  'auto-move-projects-daily',
  '0 0 * * *', -- Every day at midnight
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/auto-move-projects',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
\`\`\`

## בדיקה

### 1. וודא שהמערכת פועלת
- [ ] ניתן להיכנס ל-landing page
- [ ] ניתן להירשם ולהתחבר
- [ ] Dashboard מציג נתונים
- [ ] ניתן ליצור פרויקט (אם DB מוגדר)

### 2. וודא Integrations
- [ ] B2 - קבלת presigned URL
- [ ] Cloudflare - גישה לקבצים דרך CDN
- [ ] Green API - מצב Instance פעיל
- [ ] Supabase - Edge Functions עובדות

## תמיכה

אם נתקלת בבעיה:
1. בדוק את הלוגים בVercel
2. בדוק את Database ב-Supabase
3. בדוק את Edge Functions logs
4. וודא שכל המשתנים מוגדרים נכון

## עדכונים עתידיים

כדי לעדכן את המערכת:
\`\`\`bash
git pull origin main
git push
\`\`\`

Vercel יעדכן אוטומטית!
