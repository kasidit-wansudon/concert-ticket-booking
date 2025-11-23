import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConcertDocument = Concert & Document;

@Schema({ timestamps: true })
export class Concert {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  totalSeats: number;

  @Prop({ required: true })
  availableSeats: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Reservation' }] })
  reservations: Types.ObjectId[];
}

export const ConcertSchema = SchemaFactory.createForClass(Concert);

ConcertSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
