import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { Types } from 'mongoose';

describe('ConcertsController', () => {
    let controller: ConcertsController;
    let service: ConcertsService;

    const mockConcert = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Test Concert',
        description: 'Test Description',
        totalSeats: 100,
        availableSeats: 50,
        id: '507f1f77bcf86cd799439011',
    };

    const mockConcertsService = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ConcertsController],
            providers: [
                {
                    provide: ConcertsService,
                    useValue: mockConcertsService,
                },
            ],
        }).compile();

        controller = module.get<ConcertsController>(ConcertsController);
        service = module.get<ConcertsService>(ConcertsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return an array of concerts', async () => {
            const concerts = [mockConcert];
            mockConcertsService.findAll.mockResolvedValue(concerts);

            const result = await controller.findAll();

            expect(result).toEqual(concerts);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return a concert by id', async () => {
            mockConcertsService.findById.mockResolvedValue(mockConcert);

            const result = await controller.findById('507f1f77bcf86cd799439011');

            expect(result).toEqual(mockConcert);
            expect(service.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });
    });

    describe('create', () => {
        it('should create a new concert', async () => {
            const createDto = {
                name: 'New Concert',
                description: 'New Description',
                totalSeats: 200,
            };

            mockConcertsService.create.mockResolvedValue(mockConcert);

            const result = await controller.create(createDto);

            expect(result).toEqual(mockConcert);
            expect(service.create).toHaveBeenCalledWith(
                createDto.name,
                createDto.description,
                createDto.totalSeats,
            );
        });
    });

    describe('update', () => {
        it('should update a concert', async () => {
            const updateDto = {
                name: 'Updated Concert',
                description: 'Updated Description',
            };

            const updatedConcert = { ...mockConcert, ...updateDto };
            mockConcertsService.update.mockResolvedValue(updatedConcert);

            const result = await controller.update('507f1f77bcf86cd799439011', updateDto);

            expect(result).toEqual(updatedConcert);
            expect(service.update).toHaveBeenCalledWith(
                '507f1f77bcf86cd799439011',
                updateDto,
            );
        });
    });

    describe('delete', () => {
        it('should delete a concert', async () => {
            mockConcertsService.delete.mockResolvedValue(undefined);

            await controller.delete('507f1f77bcf86cd799439011');

            expect(service.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });
    });
});
