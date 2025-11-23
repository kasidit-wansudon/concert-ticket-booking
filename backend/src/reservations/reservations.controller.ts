import { Controller, Get, Post, Body, Patch, Param, BadRequestException, Headers } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { UsersService } from '../users/users.service';

@Controller('reservations')
export class ReservationsController {
    constructor(
        private readonly reservationsService: ReservationsService,
        private readonly usersService: UsersService,
    ) { }

    @Get()
    findAll() {
        return this.reservationsService.findAll();
    }

    @Get('my')
    async getMyReservations(@Headers('x-user-id') userId: string) {
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }
        return this.reservationsService.findByUserId(userId);
    }

    @Post()
    async create(
        @Body() body: { concertId: string },
        @Headers('x-user-id') userId: string,
    ) {
        if (!body.concertId) {
            throw new BadRequestException('Concert ID is required');
        }
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }
        return this.reservationsService.create(userId, body.concertId);
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string) {
        return this.reservationsService.cancel(id);
    }
}
