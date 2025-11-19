Initialize frontend and backend project structure
Added initial frontend and backend directories with configuration files, admin pages, global styles, utility libraries, and type definitions. Removed root README.md and added .gitignore for frontend. This sets up the base structure for a concert ticket booking system using Next.js and NestJS.
72e200b
README.md
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
