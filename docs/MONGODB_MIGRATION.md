# MongoDB Migration Guide

## การเปลี่ยนแปลงที่ทำ

### 1. Dependencies
- ✅ เพิ่ม `@nestjs/mongoose` และ `mongoose`
- ✅ ลบ `@nestjs/typeorm`, `typeorm`, และ `pg`

### 2. Configuration
- ✅ อัปเดต `.env` ให้ใช้ `MONGODB_URI`
- ✅ อัปเดต `.env.example` เป็นตัวอย่าง MongoDB connection string
- ✅ อัปเดต `app.module.ts` ให้ใช้ `MongooseModule` แทน `TypeOrmModule`
- ✅ ลบ `typeorm.config.ts` ที่ไม่ใช้แล้ว

### 3. Entities → Schemas
แปลง TypeORM entities เป็น Mongoose schemas:

#### User Entity
- ✅ ใช้ `@Schema()` และ `@Prop()` decorators
- ✅ เพิ่ม `UserDocument` type
- ✅ สร้าง `UserSchema` ด้วย `SchemaFactory`
- ✅ Timestamps จัดการโดย `{ timestamps: true }`

#### Concert Entity
- ✅ แปลงเป็น Mongoose schema
- ✅ เพิ่ม `ConcertDocument` type
- ✅ สร้าง `ConcertSchema`

#### Reservation Entity
- ✅ แปลงเป็น Mongoose schema
- ✅ ใช้ `Types.ObjectId` สำหรับ references
- ✅ เพิ่ม `ReservationDocument` type
- ✅ สร้าง `ReservationSchema`

### 4. Services
อัปเดตทุก services ให้ใช้ Mongoose API:

#### UsersService
- ✅ ใช้ `@InjectModel()` แทน `@InjectRepository()`
- ✅ ใช้ `Model<UserDocument>` แทน `Repository<User>`
- ✅ อัปเดต query methods: `findOne({ email })`, `findById(id)`, etc.

#### ConcertsService
- ✅ สร้างใหม่พร้อม Mongoose API
- ✅ CRUD operations สำหรับ concerts

#### ReservationsService
- ✅ สร้างใหม่พร้อม Mongoose API
- ✅ จัดการ reservations และอัปเดต available seats

### 5. Modules
- ✅ อัปเดต `UsersModule` ให้ใช้ `MongooseModule.forFeature()`
- ✅ สร้าง `ConcertsModule` ใหม่
- ✅ สร้าง `ReservationsModule` ใหม่
- ✅ สร้าง `AuthModule` พื้นฐาน

### 6. Package.json
- ✅ ลบ TypeORM migration scripts

## MongoDB Connection String
```
mongodb+srv://kasidit:password@clusterstart.frxult6.mongodb.net/concert-ticket-booking?retryWrites=true&w=majority&appName=ClusterStart
```

## การทดสอบ
✅ Backend server เริ่มทำงานสำเร็จ
✅ MongoDB เชื่อมต่อสำเร็จ (MongooseCoreModule initialized)
✅ Server รันที่ http://localhost:3001/api

## สิ่งที่ต้องทำต่อ (ถ้าจำเป็น)
1. สร้าง Controllers สำหรับ API endpoints
2. เพิ่ม DTOs สำหรับ validation
3. ตั้งค่า Authentication/Authorization
4. เพิ่ม unit tests และ e2e tests
5. อัปเดต frontend ให้เชื่อมต่อกับ MongoDB backend

## คำแนะนำในการใช้งาน

### เริ่มต้น Backend Server
```bash
npm run start:dev --prefix backend
```

### ดู Logs
เซิร์ฟเวอร์จะแสดง logs เมื่อเชื่อมต่อ MongoDB สำเร็จ
