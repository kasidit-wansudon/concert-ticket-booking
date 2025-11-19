# Concert Booking Frontend

Next.js 14 frontend application for concert ticket booking system.

## Features

- **User Interface**: Browse concerts and reserve tickets
- **Admin Dashboard**: Manage concerts and view reservation history
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3001`

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                  # Next.js App Router pages
│   ├── page.tsx         # User concert list page
│   ├── admin/           # Admin pages
│   │   ├── page.tsx     # Admin dashboard
│   │   ├── create/      # Create concert
│   │   ├── edit/[id]/   # Edit concert
│   │   └── history/     # Reservation history
│   └── layout.tsx       # Root layout
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   ├── ConcertCard.tsx
│   ├── ConcertStats.tsx
│   └── ...more
├── lib/                # Utilities and API
│   ├── api.ts         # API client
│   ├── types.ts       # TypeScript types
│   └── utils.ts       # Helper functions
└── public/            # Static assets
```

## Pages

### User Pages
- `/` - Concert list with reservation functionality

### Admin Pages
- `/admin` - Admin dashboard with concert management
- `/admin/create` - Create new concert
- `/admin/edit/[id]` - Edit existing concert
- `/admin/history` - View all reservation history

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Toast Notifications**: react-hot-toast

## API Integration

All API calls are made through `/lib/api.ts`:

- `concertApi.getAll()` - Get all concerts
- `concertApi.create()` - Create concert (admin)
- `reservationApi.create()` - Reserve ticket (user)
- More endpoints in `lib/api.ts`
