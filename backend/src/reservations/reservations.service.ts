import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation, ReservationDocument, ReservationStatus } from './entities/reservation.entity';
import { ConcertsService } from '../concerts/concerts.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    private concertsService: ConcertsService,
  ) { }

  /**
   * Find all reservations
   */
  async findAll(): Promise<ReservationDocument[]> {
    return this.reservationModel
      .find()
      .populate('concert')
      .populate('user')
      .exec();
  }

  /**
   * Find all reservations for a user
   */
  async findByUserId(userId: string): Promise<ReservationDocument[]> {
    return this.reservationModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('concert')
      .populate('user')
      .exec();
  }

  /**
   * Find reservation by ID
   */
  async findById(id: string): Promise<ReservationDocument | null> {
    return this.reservationModel
      .findById(id)
      .populate('concert')
      .populate('user')
      .exec();
  }

  /**
   * Create new reservation
   */
  async create(userId: string, concertId: string): Promise<ReservationDocument> {
    // Check if concert exists
    const concert = await this.concertsService.findById(concertId);
    if (!concert) {
      throw new NotFoundException('Concert not found');
    }

    // Check if seats are available
    if (concert.availableSeats <= 0) {
      throw new BadRequestException('No seats available');
    }

    // Create reservation
    const reservation = new this.reservationModel({
      userId: new Types.ObjectId(userId),
      concertId: new Types.ObjectId(concertId),
      status: ReservationStatus.ACTIVE,
    });

    await reservation.save();

    // Update available seats
    await this.concertsService.updateAvailableSeats(
      concertId,
      concert.availableSeats - 1,
    );

    return reservation;
  }

  /**
   * Cancel reservation
   */
  async cancel(id: string): Promise<ReservationDocument> {
    const reservation = await this.reservationModel.findById(id).exec();

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Reservation already cancelled');
    }

    // Update reservation status
    reservation.status = ReservationStatus.CANCELLED;
    await reservation.save();

    // Restore available seats
    const concert = await this.concertsService.findById(
      reservation.concertId.toString(),
    );
    if (concert) {
      await this.concertsService.updateAvailableSeats(
        reservation.concertId.toString(),
        concert.availableSeats + 1,
      );
    }

    return reservation;
  }
}
