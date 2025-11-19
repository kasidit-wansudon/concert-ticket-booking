import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Concert } from '../../concerts/entities/concert.entity';
import { User } from '../../users/entities/user.entity';

export enum ReservationStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  concertId: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Concert, (concert) => concert.reservations)
  @JoinColumn({ name: 'concertId' })
  concert: Concert;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
