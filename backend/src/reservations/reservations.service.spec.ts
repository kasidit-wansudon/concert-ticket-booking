import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation, ReservationDocument, ReservationStatus } from './entities/reservation.entity';
import { ConcertsService } from '../concerts/concerts.service';

describe('ReservationsService', () => {
    let service: ReservationsService;
    let model: Model<ReservationDocument>;
    let concertsService: ConcertsService;

    const mockUserId = new Types.ObjectId('507f1f77bcf86cd799439011');
    const mockConcertId = new Types.ObjectId('507f1f77bcf86cd799439012');
    const mockReservationId = new Types.ObjectId('507f1f77bcf86cd799439013');

    const mockConcert = {
        _id: mockConcertId,
        name: 'Test Concert',
        description: 'Test Description',
        totalSeats: 100,
        availableSeats: 50,
    };

    const mockReservation = {
        _id: mockReservationId,
        userId: mockUserId,
        concertId: mockConcertId,
        status: ReservationStatus.ACTIVE,
        save: jest.fn().mockResolvedValue(this),
    };

    const mockReservationModel = {
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockConcertsService = {
        findById: jest.fn(),
        updateAvailableSeats: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReservationsService,
                {
                    provide: getModelToken(Reservation.name),
                    useValue: mockReservationModel,
                },
                {
                    provide: ConcertsService,
                    useValue: mockConcertsService,
                },
            ],
        }).compile();

        service = module.get<ReservationsService>(ReservationsService);
        model = module.get<Model<ReservationDocument>>(getModelToken(Reservation.name));
        concertsService = module.get<ConcertsService>(ConcertsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all reservations with populated user and concert', async () => {
            const reservations = [mockReservation];
            mockReservationModel.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(reservations),
            });

            const result = await service.findAll();

            expect(result).toEqual(reservations);
            expect(mockReservationModel.find).toHaveBeenCalled();
        });
    });

    describe('findByUserId', () => {
        it('should return reservations for a specific user', async () => {
            const reservations = [mockReservation];
            mockReservationModel.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(reservations),
            });

            const result = await service.findByUserId(mockUserId.toString());

            expect(result).toEqual(reservations);
            expect(mockReservationModel.find).toHaveBeenCalledWith({
                userId: mockUserId,
            });
        });
    });

    describe('findById', () => {
        it('should return a reservation by id', async () => {
            mockReservationModel.findById.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockReservation),
            });

            const result = await service.findById(mockReservationId.toString());

            expect(result).toEqual(mockReservation);
            expect(mockReservationModel.findById).toHaveBeenCalledWith(
                mockReservationId.toString(),
            );
        });

        it('should return null for non-existent reservation', async () => {
            mockReservationModel.findById.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await service.findById(mockReservationId.toString());

            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a reservation and decrease available seats', async () => {
            mockConcertsService.findById.mockResolvedValue(mockConcert);
            mockConcertsService.updateAvailableSeats.mockResolvedValue(mockConcert);

            const mockSave = jest.fn().mockResolvedValue(mockReservation);
            const mockReservationInstance = {
                ...mockReservation,
                save: mockSave,
            };

            // Mock the constructor
            (model as any) = jest.fn().mockReturnValue(mockReservationInstance);
            service['reservationModel'] = model as any;

            const result = await service.create(
                mockUserId.toString(),
                mockConcertId.toString(),
            );

            expect(mockConcertsService.findById).toHaveBeenCalledWith(
                mockConcertId.toString(),
            );
            expect(mockConcertsService.updateAvailableSeats).toHaveBeenCalledWith(
                mockConcertId.toString(),
                49,
            );
        });

        it('should throw NotFoundException when concert does not exist', async () => {
            mockConcertsService.findById.mockResolvedValue(null);

            await expect(
                service.create(mockUserId.toString(), mockConcertId.toString()),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException when no seats available', async () => {
            const fullConcert = { ...mockConcert, availableSeats: 0 };
            mockConcertsService.findById.mockResolvedValue(fullConcert);

            await expect(
                service.create(mockUserId.toString(), mockConcertId.toString()),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('cancel', () => {
        it('should cancel reservation and restore available seats', async () => {
            const activeReservation = {
                ...mockReservation,
                status: ReservationStatus.ACTIVE,
                save: jest.fn().mockResolvedValue(mockReservation),
            };

            mockReservationModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(activeReservation),
            });

            mockConcertsService.findById.mockResolvedValue(mockConcert);
            mockConcertsService.updateAvailableSeats.mockResolvedValue(mockConcert);

            const result = await service.cancel(mockReservationId.toString());

            expect(activeReservation.status).toBe(ReservationStatus.CANCELLED);
            expect(activeReservation.save).toHaveBeenCalled();
            expect(mockConcertsService.updateAvailableSeats).toHaveBeenCalledWith(
                mockConcertId.toString(),
                51,
            );
        });

        it('should throw NotFoundException when reservation does not exist', async () => {
            mockReservationModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(
                service.cancel(mockReservationId.toString()),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException when reservation already cancelled', async () => {
            const cancelledReservation = {
                ...mockReservation,
                status: ReservationStatus.CANCELLED,
            };

            mockReservationModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(cancelledReservation),
            });

            await expect(
                service.cancel(mockReservationId.toString()),
            ).rejects.toThrow(BadRequestException);
        });
    });
});
