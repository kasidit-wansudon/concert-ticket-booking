# Full-stack Developer Assignment  
**Tech Stack:** Next.js (Frontend), NestJS (Backend)  
**เวลาที่ใช้:** 7 วัน

***

## User Stories / Tasks

### Task 1: Basic Setup and Landing Page
- สร้างโปรเจ็กต์ใหม่ด้วย Next.js สำหรับฝั่งหน้าเว็บ และ NestJS สำหรับฝั่ง Backend
- สร้าง Landing Page โดยใช้ Next.js ให้เป็นจุดเริ่มต้นของแอป

### Task 2: Responsive Design
- ออกแบบแอปให้แสดงผลบนหลายอุปกรณ์ (Mobile, Tablet, Desktop) ตามดีไซน์ใน Figma
- ใช้ CSS/HTML สำหรับการออกแบบ สามารถใช้ CSS Framework (เช่น Tailwind) แต่ต้องมี Custom CSS/HTML ที่ชัดเจนด้วย

### Task 3: Free Concert Tickets – CRUD
#### Admin
- สร้าง/ลบ Concert  
  - กำหนด Name, Description และจำนวน Seat
- ดูประวัติการจองของผู้ใช้ทั้งหมด

#### User
- ดู Concert ทั้งหมด (รวมถึงที่ตั๋วหมดแล้ว)
- จองที่นั่ง (1 user จองได้ 1 seat)
- ยกเลิกการจองที่นั่ง
- ดูประวัติการจองของตัวเอง

**Figma Design:**  
[เข้าสู่ Figma](https://www.figma.com/file/OiQSDKbuwLpFCxpnLkTiNP/Concert?type=design&node-id=0-1&mode=design&t=mNFbliIhsKArwma6-0)

### Task 4: Server Side Error Handling
1. ทำ server-side validation (เช่นข้อมูลไม่ครบ ต้องแจ้ง error)
2. แสดง error response ที่ฝั่ง Client อย่างเหมาะสม

### Task 5: Unit Tests
- ฟังก์ชัน backend (CRUD) ต้องมี unit test ครบถ้วน
- frontend tests ไม่บังคับ (ทำได้จะได้โบนัส)

***

## Delivery
- ส่งลิงก์ GitHub repository ที่มีโค้ดโปรเจ็กต์ทั้งหมด
- ควร commit อย่างต่อเนื่อง เพื่อให้เห็นการพัฒนา หลีกเลี่ยง commit ใหญ่ครั้งเดียว
- **README** ต้องประกอบด้วย:
    - วิธี setup/config local
    - สรุปภาพรวมการออกแบบ application architecture
    - รายการ library/package ที่ใช้ และหน้าที่ของแต่ละตัว
    - วิธีรัน unit tests

***

## Review Criteria
- **ความถูกต้องและครบถ้วน:** ทำตาม user story และ requirement ได้ครบหรือไม่?
- **โครงสร้างโค้ด:** อ่านง่าย ดูแลรักษาง่าย
- **Responsive Design:** ใช้งานได้ดีบนอุปกรณ์หลากหลาย
- **Error Handling:** รองรับ error ทั้งฝั่ง backend และ frontend
- **Testing:** Unit test ครบถ้วนและผ่านครบ
- **Documentation:** README ครอบคลุมครบวิธี run, setup, test แอป

***

## หมายเหตุ
- ควรใช้เวลาไม่มากกว่า 3-4 ชั่วโมง ถ้าติดขัดในบาง task ให้ทำส่วนอื่น ๆ ให้มากที่สุด
- มีความสำคัญเท่ากันในการดูวิธีรับมือเมื่อเจอโจทย์ที่ไม่ชัดเจนหรือยาก

***

## Bonus Task (Optional)
- เสนอวิธีปรับปรุงเว็บไซต์เมื่อมีข้อมูลขนาดใหญ่หรือผู้เข้าชมจำนวนมาก ทำให้เว็บช้า
- เสนอวิธีจัดการกรณีมีผู้ใช้หลายคนมาจองตั๋วพร้อมกัน เพื่อให้แน่ใจว่าไม่มีผู้ชมคนไหนต้องยืนระหว่างคอนเสิร์ต

***

**ไฟล์นี้สามารถ copy ไปใช้งานหรือแนบไว้ที่ root ของโปรเจ็กต์ได้เลย**