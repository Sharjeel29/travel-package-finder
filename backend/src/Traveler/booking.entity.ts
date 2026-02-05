import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TravelerEntity } from './traveler.entity';

@Entity('booking')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageId: number;

  @Column('date')
  travelDate: string;

  @Column('int')
  seats: number;

  @ManyToOne(() => TravelerEntity, (traveler) => traveler.bookings)
  traveler: TravelerEntity;
}
