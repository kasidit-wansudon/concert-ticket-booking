# Concert Ticket Booking System

ระบบจองตั๋วคอนเสิร์ตออนไลน์ แบบ Full-stack พัฒนาด้วย Next.js และ NestJS

## 🎯 Project Overview

แอปพลิเคชันที่ให้ผู้ใช้สามารถดูและจองตั๋วคอนเสิร์ตได้ฟรี โดยผู้ดูแลระบบสามารถจัดการคอนเสิร์ตและดูประวัติการจองทั้งหมด ระบบรองรับการจอง 1 ที่นั่งต่อคน

## 🏗️ Application Architecture

### System Overview
```
┌─────────────┐      HTTP/REST      ┌──────────────┐      Mongoose      ┌──────────┐
│   Next.js   │ ←─────────────────→ │    NestJS    │ ←─────────────────→ │ MongoDB  │
│  (Frontend) │                     │   (Backend)  │                     │          │
│   Port 3000 │                     │   Port 3001  │                     │  Port    │
│             │                     │              │                     │  27017   │
└─────────────┘                     └──────────────┘                     └──────────┘
```

### Frontend Architecture (Next.js 14)
- **App Router**: Modern routing ด้วย file-based structure
- **Components**:
  - `AdminLayout` - Layout สำหรับ Admin (Sidebar + Hamburger menu)
  - `UserLayout` - Layout สำหรับ User (Authentication check)
  - Shared components สำหรับ forms, cards, tables
- **Pages**:
  - `/` - User home (Concert list)
  - `/history` - User history
  - `/login` - Login by name
  - `/admin` - Admin dashboard
  - `/admin/history` - All reservations
- **State Management**: React Hooks (useState, useEffect)
- **API Client**: Axios with interceptors for auth headers
- **Styling**: Tailwind CSS + Custom CSS (@/styles/button-effects.css)

### Backend Architecture (NestJS)
- **Modules**:
  - `ConcertsModule` - Concert CRUD operations
  - `ReservationsModule` - Reservation management with seat validation
  - `UsersModule` - User authentication (Login by name)
- **Controllers**: RESTful API endpoints
- **Services**: Business logic and data access
- **Entities**: Mongoose schemas with virtual population
- **Validation**: DTO validation with class-validator

### Database Schema (MongoDB)
```typescript
Concerts
- _id: ObjectId
- name: String
- description: String  
- totalSeats: Number
- availableSeats: Number
- createdAt: Date
- updatedAt: Date

Reservations
- _id: ObjectId
- userId: ObjectId (ref: 'User')
- concertId: ObjectId (ref: 'Concert')
- status: Enum ['active', 'cancelled']
- createdAt: Date
- updatedAt: Date
// Virtual fields (populated):
- user: UserDocument
- concert: ConcertDocument

Users
- _id: ObjectId
- email: String (unique)
- name: String
- password: String (hashed with bcrypt)
- role: String (default: 'user')
```

## 📦 Tech Stack & Libraries

### Frontend Dependencies
| Library | Version | Purpose |
|---------|---------|---------|
| `next` | 14.2.0 | React framework with App Router |
| `react` | ^18.3.0 | UI library |
| `react-dom` | ^18.3.0 | React DOM renderer |
| `axios` | ^1.6.8 | HTTP client แทน fetch พร้อม interceptors |
| `tailwindcss` | ^3.4.3 | Utility-first CSS framework |
| `react-hot-toast` | ^2.4.1 | Toast notifications for user feedback |
| `clsx` | ^2.1.0 | Conditional className utility |
| `tailwind-merge` | ^2.2.2 | Merge Tailwind classes without conflicts |

### Backend Dependencies
| Library | Version | Purpose |
|---------|---------|---------|
| `@nestjs/core` | ^10.0.0 | NestJS core framework |
| `@nestjs/common` | ^10.0.0 | Common utilities (pipes, guards, decorators) |
| `@nestjs/mongoose` | ^11.0.3 | Mongoose integration for MongoDB |
| `mongoose` | ^8.9.3 | MongoDB ODM |
| `bcrypt` | ^5.1.1 | Password hashing |
| `class-validator` | ^0.14.1 | DTO validation |
| `class-transformer` | ^0.5.1 | Object transformation |

### Development & Testing
| Library | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5 | Type safety across the stack |
| `jest` | ^29.5.0 | Testing framework |
| `@nestjs/testing` | ^10.0.0 | NestJS testing utilities |
| `eslint` | - | Code linting |
| `prettier` | - | Code formatting |

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB 6+ (ติดตั้งและรันแล้ว)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/kasidit-wansudon/concert-ticket-booking.git
cd concert-ticket-booking
```

### 2. Backend Setup

```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
สร้างไฟล์ `.env` ใน `backend/`:
```env
DATABASE_URI=mongodb://localhost:27017/concert_booking
PORT=3001
```

#### Start Backend Server
```bash
npm run start:dev
```
✅ Backend จะรันที่ `http://localhost:3001`

### 3. Frontend Setup

เปิด terminal ใหม่:
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
สร้างไฟล์ `.env.local` ใน `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Start Frontend Server
```bash
npm run dev
```
✅ Frontend จะรันที่ `http://localhost:3000`

## 🧪 Running Unit Tests

### Backend Tests (27 Tests)

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:cov

# Run specific test file
npm test -- concerts.service.spec.ts
```

**Test Coverage:**
- ✅ ConcertsService (8 tests)
- ✅ ReservationsService (9 tests)
- ✅ ConcertsController (5 tests)
- ✅ ReservationsController (5 tests)

**Expected Output:**
```
Test Suites: 4 passed, 4 total
Tests:       27 passed, 27 total
```

## 📱 Features Implemented

### User Features
- ✅ **Login by Name** - เข้าสู่ระบบด้วยชื่อ (ไม่ต้องใช้ email/password)
- ✅ **View Concerts** - ดูคอนเสิร์ตทั้งหมด (รวมที่เต็มแล้ว)
- ✅ **Reserve Seat** - จองที่นั่ง (1 ที่/คน/คอนเสิร์ต)
- ✅ **Cancel Reservation** - ยกเลิกได้ทั้งจากหน้าแรกและหน้า History
- ✅ **View History** - ดูประวัติการจองของตัวเอง (แสดงชื่อ User และ Concert)
- ✅ **Responsive Design** - รองรับ Mobile, Tablet, Desktop

### Admin Features
- ✅ **Create Concert** - สร้างคอนเสิร์ต (Name, Description, Total Seats)
- ✅ **Delete Concert** - ลบคอนเสิร์ต
- ✅ **View All Reservations** - ดูประวัติการจองทั้งหมด (เห็นชื่อ User + Concert)
- ✅ **Monitor Seats** - เช็คจำนวนที่นั่งคงเหลือ

### Technical Features
- ✅ **Server-side Validation** - ตรวจสอบข้อมูลที่ Backend (Concert not found, No seats, etc.)
- ✅ **Error Handling** - แสดง error ที่ Frontend ผ่าน Toast notifications
- ✅ **Authentication** - ระบบ Login by name พร้อม localStorage
- ✅ **Unit Tests** - ครบ 27 tests สำหรับ Backend
- ✅ **Custom CSS** - Button effects (ripple, glow, hover animations)
- ✅ **Virtual Populate** - MongoDB populate user และ concert ใน response

## 🔐 API Endpoints

### Base URL: `http://localhost:3001/api`

### Users
```http
POST /users/login
Body: { name: string }
Response: UserDocument

GET /users/:email
Response: UserDocument

POST /users
Body: { email, name, password }
Response: UserDocument
```

### Concerts
```http
GET /concerts
Response: Concert[]

GET /concerts/:id
Response: Concert

POST /concerts (Admin)
Body: { name, description, totalSeats }
Response: Concert

PATCH /concerts/:id (Admin)
Body: Partial<Concert>
Response: Concert

DELETE /concerts/:id (Admin)
Response: void
```

### Reservations
```http
GET /reservations (Admin)
Response: Reservation[] (with populated user & concert)

GET /reservations/my
Headers: { x-user-id }
Response: Reservation[]

POST /reservations
Headers: { x-user-id }
Body: { concertId }
Response: Reservation

PATCH /reservations/:id/cancel
Response: Reservation
```

## 🎨 Custom CSS Features

ไฟล์ `frontend/styles/button-effects.css` ประกอบด้วย:
- **Ripple Effect** - คลื่นน้ำขยายตอนกดปุ่ม
- **Hover Lift** - ปุ่มลอยขึ้น 2px พร้อม box-shadow
- **Press Effect** - Scale down ตอนกด (scale 0.98)
- **Color Glows** - แสงเรืองตามสีปุ่ม (น้ำเงิน/แดง/เขียว)
- **Icon Rotate** - ไอคอน SVG หมุน 5° ตอน hover
- **Smooth Transitions** - 1.3s cubic-bezier animation

## 💡 Bonus: Performance & Scalability Suggestions

### สำหรับ High Traffic
1. **Caching**: Redis สำหรับ concert list และ session
2. **Database**: Indexing, Connection pooling, Read replicas
3. **Backend**: Horizontal scaling, Load balancer, Rate limiting
4. **Frontend**: SSR/SSG, Code splitting, CDN

### สำหรับ Concurrent Reservations
1. **Transaction**: ใช้ MongoDB transactions พร้อม row-level locking
2. **Validation**: Check `availableSeats > 0` ก่อน update atomically
3. **Queue System**: FIFO queue ด้วย Redis
4. **Optimistic Locking**: Version field สำหรับ concurrency control

## 📝 Development Notes

- ✅ Regular commits แสดงการพัฒนาอย่างต่อเนื่อง
- ✅ Error handling ทั้ง client และ server
- ✅ TypeScript สำหรับ type safety
- ✅ Environment variables สำหรับ configuration
- ✅ Comprehensive unit tests (27 tests)
- ✅ Responsive design ตาม Figma spec

## 📄 License

MIT
