import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ReservationStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Concert', required: true })
  concertId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;

  // Virtual fields for populated data
  user?: any;
  concert?: any;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

// Configure virtual populate for user
ReservationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Configure virtual populate for concert
ReservationSchema.virtual('concert', {
  ref: 'Concert',
  localField: 'concertId',
  foreignField: '_id',
  justOne: true,
});

ReservationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
