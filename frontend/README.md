# Concert Ticket Booking System

A full-stack concert ticket reservation application built with Next.js and NestJS.

## 🎯 Project Overview

This application allows users to browse concerts and reserve tickets, while admins can manage concerts and view reservation history. The system ensures fair ticket distribution with one seat per user.

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks and context
- **API Communication**: Fetch API/Axios for REST calls

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT-based authentication
- **Validation**: class-validator and class-transformer
- **API Design**: RESTful endpoints

### Database Schema
```
Concerts
- id (PK)
- name
- description
- totalSeats
- availableSeats
- createdAt
- updatedAt

Reservations
- id (PK)
- userId
- concertId (FK)
- status (active/cancelled)
- createdAt
- updatedAt

Users
- id (PK)
- email
- name
- role (admin/user)
- password (hashed)
```

## 📦 Tech Stack & Libraries

### Frontend Dependencies
- **next**: React framework for production
- **react** & **react-dom**: UI library
- **tailwindcss**: Utility-first CSS framework
- **axios**: HTTP client for API requests
- **react-hook-form**: Form validation
- **zod**: Schema validation

### Backend Dependencies
- **@nestjs/core**: NestJS framework core
- **@nestjs/common**: Common utilities
- **@nestjs/typeorm**: TypeORM integration
- **typeorm**: ORM for database operations
- **pg**: PostgreSQL driver
- **class-validator**: DTO validation
- **class-transformer**: Object transformation
- **@nestjs/jwt**: JWT authentication
- **bcrypt**: Password hashing

### Development Dependencies
- **typescript**: Type safety
- **jest**: Testing framework
- **@nestjs/testing**: NestJS testing utilities
- **eslint**: Code linting
- **prettier**: Code formatting

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=concert_booking
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

4. Create database:
```bash
psql -U postgres
CREATE DATABASE concert_booking;
\q
```

5. Run migrations:
```bash
npm run migration:run
```

6. Start development server:
```bash
npm run start:dev
```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🧪 Running Tests

### Backend Unit Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm test -- concerts.service.spec.ts
```

### Frontend Tests (Bonus)

```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📱 Features

### User Features
- ✅ View all concerts (including sold-out concerts)
- ✅ Reserve one seat per concert
- ✅ Cancel reservation
- ✅ View personal reservation history
- ✅ Responsive design (mobile, tablet, desktop)

### Admin Features
- ✅ Create new concerts
- ✅ Delete concerts
- ✅ View all users' reservation history
- ✅ Monitor seat availability

### Technical Features
- ✅ Server-side validation
- ✅ Client-side error handling
- ✅ JWT authentication
- ✅ Unit tests for backend
- ✅ Responsive UI design

## 🎨 Design

The application follows the Figma design specifications with:
- Mobile-first responsive approach
- Tailwind CSS utilities
- Custom components for reusability
- Consistent color scheme and typography

## 🔐 API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
GET /api/auth/profile - Get current user
```

### Concerts
```
GET /api/concerts - Get all concerts
GET /api/concerts/:id - Get concert by ID
POST /api/concerts - Create concert (Admin)
DELETE /api/concerts/:id - Delete concert (Admin)
```

### Reservations
```
GET /api/reservations - Get all reservations (Admin)
GET /api/reservations/my - Get user's reservations
POST /api/reservations - Create reservation
DELETE /api/reservations/:id - Cancel reservation
```

## 💡 Bonus: Performance Optimization

### For Intensive Data & High Traffic:

1. **Database Optimization**
   - Add database indexing on frequently queried fields
   - Implement query optimization and pagination
   - Use database connection pooling
   - Consider read replicas for heavy read operations

2. **Caching Strategy**
   - Redis for session management and frequently accessed data
   - Cache concert list with invalidation on updates
   - CDN for static assets
   - Browser caching headers

3. **Backend Scaling**
   - Horizontal scaling with load balancers
   - Implement API rate limiting
   - Use message queues (RabbitMQ/Redis) for async operations
   - Microservices architecture for independent scaling

4. **Frontend Optimization**
   - Server-Side Rendering (SSR) for initial load
   - Static Site Generation (SSG) for concert listings
   - Code splitting and lazy loading
   - Image optimization with Next.js Image component
   - Bundle size optimization

### For Concurrent Ticket Reservations:

1. **Database-Level Concurrency**
   - Use database transactions with proper isolation levels
   - Implement optimistic locking with version numbers
   - Row-level locking during reservation
   ```sql
   SELECT * FROM concerts WHERE id = ? FOR UPDATE;
   UPDATE concerts SET availableSeats = availableSeats - 1 
   WHERE id = ? AND availableSeats > 0;
   ```

2. **Queue System**
   - Implement reservation queue (FIFO)
   - Process reservations sequentially
   - Use Redis for queue management
   - Provide position updates to users

3. **Inventory Management**
   - Check-and-set pattern
   - Atomic counter operations
   - Pre-reservation timeout mechanism
   - Release reserved but unpaid tickets after timeout

4. **Race Condition Prevention**
   ```typescript
   // Example NestJS service implementation
   async reserveSeat(concertId: string, userId: string) {
     return await this.dataSource.transaction(async (manager) => {
       // Lock the concert row
       const concert = await manager
         .createQueryBuilder(Concert, 'concert')
         .setLock('pessimistic_write')
         .where('concert.id = :id', { id: concertId })
         .getOne();

       if (!concert || concert.availableSeats <= 0) {
         throw new BadRequestException('No seats available');
       }

       // Check if user already has reservation
       const existing = await manager.findOne(Reservation, {
         where: { concertId, userId, status: 'active' }
       });

       if (existing) {
         throw new BadRequestException('Already reserved');
       }

       // Create reservation and update seats atomically
       concert.availableSeats -= 1;
       await manager.save(concert);

       const reservation = manager.create(Reservation, {
         concertId,
         userId,
         status: 'active'
       });
       return await manager.save(reservation);
     });
   }
   ```

5. **Monitoring & Alerting**
   - Real-time seat availability monitoring
   - Alert system for overselling
   - Logging all reservation attempts
   - Performance metrics tracking

## 📝 Development Notes

- Regular commits showcase development progress
- Error handling implemented on both client and server
- Validation on both frontend (UX) and backend (security)
- TypeScript for type safety across the stack
- Environment variables for configuration
- Comprehensive unit tests for critical functions

## 🤝 Contributing

This is a test project, but contributions and suggestions are welcome!

## 📄 License

MIT
