import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Concert, ConcertDocument } from './entities/concert.entity';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectModel(Concert.name)
    private concertModel: Model<ConcertDocument>,
  ) { }

  /**
   * Find all concerts
   */
  async findAll(): Promise<ConcertDocument[]> {
    return this.concertModel.find().exec();
  }

  /**
   * Find concert by ID
   */
  async findById(id: string): Promise<ConcertDocument | null> {
    return this.concertModel.findById(id).exec();
  }

  /**
   * Create new concert
   */
  async create(
    name: string,
    description: string,
    totalSeats: number,
  ): Promise<ConcertDocument> {
    const concert = new this.concertModel({
      name,
      description,
      totalSeats,
      availableSeats: totalSeats,
    });

    return concert.save();
  }

  /**
   * Update available seats
   */
  async updateAvailableSeats(
    id: string,
    availableSeats: number,
  ): Promise<ConcertDocument> {
    const concert = await this.concertModel
      .findByIdAndUpdate(id, { availableSeats }, { new: true })
      .exec();

    if (!concert) {
      throw new NotFoundException('Concert not found');
    }

    return concert;
  }

  /**
   * Update concert details
   */
  async update(id: string, attrs: Partial<Concert>): Promise<ConcertDocument> {
    const concert = await this.concertModel
      .findByIdAndUpdate(id, attrs, { new: true })
      .exec();

    if (!concert) {
      throw new NotFoundException('Concert not found');
    }

    return concert;
  }

  /**
   * Delete concert
   */
  async delete(id: string): Promise<void> {
    const result = await this.concertModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Concert not found');
    }
  }
}
