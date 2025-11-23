import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { Concert, ConcertDocument } from './entities/concert.entity';

describe('ConcertsService', () => {
    let service: ConcertsService;
    let model: Model<ConcertDocument>;

    const mockConcert = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Test Concert',
        description: 'Test Description',
        totalSeats: 100,
        availableSeats: 50,
    };

    const mockConcertModel = {
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConcertsService,
                {
                    provide: getModelToken(Concert.name),
                    useValue: mockConcertModel,
                },
            ],
        }).compile();

        service = module.get<ConcertsService>(ConcertsService);
        model = module.get<Model<ConcertDocument>>(getModelToken(Concert.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return an array of concerts', async () => {
            const concerts = [mockConcert];
            mockConcertModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(concerts),
            });

            const result = await service.findAll();

            expect(result).toEqual(concerts);
            expect(mockConcertModel.find).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return a concert by id', async () => {
            mockConcertModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockConcert),
            });

            const result = await service.findById('507f1f77bcf86cd799439011');

            expect(result).toEqual(mockConcert);
        });
    });

    describe('create', () => {
        it('should create a new concert', async () => {
            const createDto = {
                name: 'New Concert',
                description: 'New Description',
                totalSeats: 200,
            };

            const mockSave = jest.fn().mockResolvedValue(mockConcert);
            const mockInstance = {
                save: mockSave,
            };

            // Mock the constructor
            (model as any) = jest.fn().mockReturnValue(mockInstance);
            service['concertModel'] = model as any;

            await service.create(createDto.name, createDto.description, createDto.totalSeats);

            expect(mockSave).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should update a concert', async () => {
            const updateDto = {
                name: 'Updated Concert',
            };

            mockConcertModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue({ ...mockConcert, ...updateDto }),
            });

            const result = await service.update('507f1f77bcf86cd799439011', updateDto);

            expect(result.name).toBe('Updated Concert');
        });

        it('should throw NotFoundException when updating non-existent concert', async () => {
            mockConcertModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(
                service.update('507f1f77bcf86cd799439011', { name: 'Updated' }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete a concert', async () => {
            mockConcertModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockConcert),
            });

            await service.delete('507f1f77bcf86cd799439011');

            expect(mockConcertModel.findByIdAndDelete).toHaveBeenCalled();
        });

        it('should throw NotFoundException when deleting non-existent concert', async () => {
            mockConcertModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.delete('507f1f77bcf86cd799439011')).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
