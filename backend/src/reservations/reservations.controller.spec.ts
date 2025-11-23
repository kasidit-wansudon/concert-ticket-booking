import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { UsersService } from '../users/users.service';
import { Types } from 'mongoose';

describe('ReservationsController', () => {
    let controller: ReservationsController;
    let reservationsService: ReservationsService;
    let usersService: UsersService;

    const mockUserId = '507f1f77bcf86cd799439011';
    const mockConcertId = '507f1f77bcf86cd799439012';
    const mockReservationId = '507f1f77bcf86cd799439013';

    const mockUser = {
        _id: new Types.ObjectId(mockUserId),
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
    };

    const mockReservation = {
        _id: new Types.ObjectId(mockReservationId),
        userId: new Types.ObjectId(mockUserId),
        concertId: new Types.ObjectId(mockConcertId),
        status: 'active',
        id: mockReservationId,
    };

    const mockReservationsService = {
        findAll: jest.fn(),
        findByUserId: jest.fn(),
        create: jest.fn(),
        cancel: jest.fn(),
    };

    const mockUsersService = {
        findById: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReservationsController],
            providers: [
                {
                    provide: ReservationsService,
                    useValue: mockReservationsService,
                },
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<ReservationsController>(ReservationsController);
        reservationsService = module.get<ReservationsService>(ReservationsService);
        usersService = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all reservations', async () => {
            const reservations = [mockReservation];
            mockReservationsService.findAll.mockResolvedValue(reservations);

            const result = await controller.findAll();

            expect(result).toEqual(reservations);
            expect(reservationsService.findAll).toHaveBeenCalled();
        });
    });

    describe('getMyReservations', () => {
        it('should return user reservations using x-user-id header', async () => {
            const reservations = [mockReservation];
            mockReservationsService.findByUserId.mockResolvedValue(reservations);

            const result = await controller.getMyReservations(mockUserId);

            expect(result).toEqual(reservations);
            expect(reservationsService.findByUserId).toHaveBeenCalledWith(mockUserId);
        });
    });

    describe('create', () => {
        it('should create reservation with x-user-id header', async () => {
            mockReservationsService.create.mockResolvedValue(mockReservation);

            const result = await controller.create(
                { concertId: mockConcertId },
                mockUserId,
            );

            expect(result).toEqual(mockReservation);
            expect(reservationsService.create).toHaveBeenCalledWith(
                mockUserId,
                mockConcertId,
            );
        });

        it('should throw BadRequestException without concertId', async () => {
            await expect(
                controller.create({} as any, mockUserId),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('cancel', () => {
        it('should cancel a reservation', async () => {
            mockReservationsService.cancel.mockResolvedValue(mockReservation);

            const result = await controller.cancel(mockReservationId);

            expect(result).toEqual(mockReservation);
            expect(reservationsService.cancel).toHaveBeenCalledWith(mockReservationId);
        });
    });
});
