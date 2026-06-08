# WhatTime - Premium World Clock & Timezone Suite

A modern, feature-rich world clock application built with React, Express, and PostgreSQL. Perfect for teams managing global schedules, timezone conversions, and meeting coordination.

## ✨ Features

- **🌍 World Clock** - Real-time display of 100+ cities across all timezones
- **⏰ Timezone Converter** - Compare times across multiple timezones simultaneously
- **📅 Meeting Invites** - Share meeting times with automatic timezone localization
- **⏳ Countdown Timer** - Create shareable countdowns for events and launches
- **🌅 DST Tracker** - Never miss daylight saving time changes
- **👥 Team Dashboard** - Find perfect meeting times for distributed teams
- **🌐 Multi-language Support** - 11 languages: EN, ES, FR, DE, ZH, JA, AR, PT, RU, IT, HE
- **🎨 Dark/Light Theme** - Customizable interface with theme persistence
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Tailwind CSS 4** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **shadcn/ui** - High-quality component library
- **i18next** - Internationalization support

### Backend
- **Express 4** - Lightweight web server
- **tRPC 11** - End-to-end type-safe APIs
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Robust relational database

### Authentication & Services
- **Manus OAuth** - Secure authentication
- **Vercel Postgres** - Managed database hosting
- **Stripe** - Payment processing (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ 
- pnpm 10+
- PostgreSQL database (or Vercel Postgres)

### Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm check
```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (API).

## 📦 Project Structure

```
chronos-time/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   └── locales/       # i18n translations
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── _core/             # Core infrastructure
│   ├── routers/           # tRPC route handlers
│   └── db.ts              # Database queries
├── drizzle/               # Database schema & migrations
├── shared/                # Shared types & constants
└── vercel.json            # Vercel deployment config
```

## 🗄️ Database Setup

### Local Development

```bash
# Generate migrations
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate

# Seed initial data (optional)
node seed-cities.mjs
```

### Production (Vercel Postgres)

1. Create database in Vercel dashboard
2. Set `DATABASE_URL` environment variable
3. Run migrations:
   ```bash
   DATABASE_URL=your_url pnpm drizzle-kit migrate
   ```

## 🔐 Environment Variables

See `.env.example` for complete list. Key variables:

```env
DATABASE_URL=postgresql://...
VITE_APP_ID=your_oauth_app_id
JWT_SECRET=your_jwt_secret
VITE_APP_TITLE=WhatTime
VITE_APP_LOGO=https://your-logo-url.png
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

See `GITHUB_DEPLOYMENT_GUIDE.md` for detailed instructions.

### Deploy to Other Platforms

The project can be deployed to any Node.js hosting:
- Railway
- Render
- Fly.io
- AWS EC2
- DigitalOcean

Ensure:
- Node.js 22+ support
- PostgreSQL database access
- Environment variables configured
- HTTPS enabled

## 📊 API Documentation

All backend APIs are built with tRPC. Type definitions are automatically generated.

### Example: Get World Clock Data

```typescript
const { data: cities } = trpc.cities.getAll.useQuery();
```

### Example: Create Meeting Invite

```typescript
const createMeeting = trpc.meetings.create.useMutation();
await createMeeting.mutateAsync({
  title: "Team Standup",
  time: new Date(),
  timezone: "UTC",
  attendees: ["user1@example.com"],
});
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test server/time.test.ts
```

## 📝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## 🐛 Known Issues

- OAuth requires HTTPS in production
- Some timezones may have DST transitions not yet reflected
- Real-time updates require WebSocket support (future feature)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/YOUR_USERNAME/whattime/issues)
- Email: support@whattime.info
- Documentation: [WhatTime Docs](https://whattime.info/docs)

## 🙏 Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Type-safe APIs with [tRPC](https://trpc.io)
- Database with [Drizzle ORM](https://orm.drizzle.team)
- Hosted on [Vercel](https://vercel.com)

---

**Made with ❤️ for global teams**
