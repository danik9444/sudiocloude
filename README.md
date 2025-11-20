# סטודיו קלאוד - Studio Cloud

מערכת SaaS לניהול פרויקטים ואחסון קבצים לצלמי חתונות ואירועים.

## 🎯 תיאור המערכת

Studio Cloud היא מערכת מקצה-לקצה המאפשרת לסטודיואים לצילום:
- 📦 לאחסן מאות GB של חומרי גלם (וידאו ותמונות) בענן
- 🤝 לשתף פרויקטים עם צלמים חיצוניים בקלות
- 📱 לקבל הודעות WhatsApp אוטומטיות כשפרויקט מוכן לעבודה
- 📊 לנהל את כל הפרויקטים במקום אחד
- 🎥 לצפות בוידאו ישירות בדפדפן
- ⚡ להוריד קבצים במהירות דרך Cloudflare CDN

## 🏗️ ארכיטקטורה

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Edge Functions + PostgreSQL + Auth)
- **Storage**: Backblaze B2 (S3-compatible)
- **CDN**: Cloudflare
- **WhatsApp**: Green API
- **Deployment**: Vercel

## 📋 דרישות מקדימות

- Node.js 18+
- npm או yarn
- חשבונות ב:
  - Supabase
  - Backblaze B2
  - Cloudflare
  - Green API (WhatsApp)
  - Vercel

## 🚀 התקנה והרצה מקומית

### 1. Clone הפרויקט
```bash
git clone https://github.com/your-username/studio-cloud.git
cd studio-cloud
```

### 2. התקן Dependencies
```bash
npm install
```

### 3. הגדר Environment Variables
העתק את `.env.example` ל-`.env.local` ומלא את הערכים:
```bash
cp .env.example .env.local
```

ערוך את `.env.local` עם הערכים האמיתיים שלך.

### 4. הגדר את Database
1. היכנס ל-Supabase Dashboard
2. פתח SQL Editor
3. העתק והרץ את התוכן מ-`supabase/schema.sql`

### 5. הרץ את הפרויקט
```bash
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000) בדפדפן.

## 📦 Build לProduction

```bash
npm run build
npm run start
```

## 🌍 Deploy ל-Production

ראה את המדריך המפורט ב-[DEPLOYMENT.md](./DEPLOYMENT.md).

### תקציר מהיר:
1. הגדר Supabase + SQL Schema
2. הגדר Backblaze B2 + Cloudflare CDN
3. הגדר Green API (WhatsApp)
4. Push ל-GitHub
5. Deploy ב-Vercel עם environment variables
6. Deploy Supabase Edge Functions

## 📁 מבנה הפרויקט

```
studio-cloud/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   └── share/             # Public share links
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── projects/         # Project components
│   ├── files/            # File components
│   └── layout/           # Layout components
├── lib/                  # Utilities
│   ├── supabase/        # Supabase clients
│   ├── b2/              # B2 integration
│   └── whatsapp/        # WhatsApp integration
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
├── supabase/           # Supabase Edge Functions
│   ├── functions/
│   └── schema.sql
└── public/             # Static assets
```

## 🔑 תכונות עיקריות

### ✅ כבר מוכן:
- 🔐 Authentication (Supabase Auth)
- 📊 Dashboard עם סטטיסטיקות
- 📁 ניהול פרויקטים (UI בלבד)
- 🗄️ Database Schema מלא + RLS
- 🎨 UI Components (shadcn/ui)
- 🪝 Custom Hooks (use-auth, use-projects, use-files, use-upload)
- 📱 RTL Support (עברית)
- 🏗️ TypeScript מלא
- 📖 Documentation מקיפה
- ✅ Build עובד

### 🔨 בהמשך (יש לממש):
- 📤 העלאת קבצים (FileUploader component - ההוק קיים)
- 📥 הורדת קבצים
- 🎥 Video Player
- 🔗 Share Links
- 📱 WhatsApp Notifications
- 🔄 Auto-move projects (Cron Job)
- 🖼️ Project Components מלאים (ProjectCard, CreateProjectDialog)
- ⚙️ Supabase Edge Functions (הקוד קיים, צריך deployment)

## 🛠️ טכנולוגיות

- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **TanStack Query** - Data Fetching
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Backblaze B2** - Object Storage
- **Cloudflare** - CDN
- **Green API** - WhatsApp Integration

## 📝 Scripts

- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 🔒 Security

המערכת כוללת:
- Row Level Security (RLS) על כל הטבלאות
- Presigned URLs לקבצים
- Auth middleware
- HTTPS בלבד
- Rate limiting (דרך Cloudflare)

## 💰 עלויות חודשיות משוערות

- **Backblaze B2**: $6/TB (~$372 ל-62TB)
- **Green API**: $12/month
- **Supabase**: $0-25/month
- **Vercel**: $0-20/month
- **Cloudflare**: $0 (Free tier)
- **סה"כ**: ~$384-429/month

## 📞 תמיכה

לשאלות ובעיות, פתח Issue ב-GitHub.

## 📄 רישיון

MIT License

---

**נבנה עם ❤️ לצלמים ולסטודיואים בישראל**
