import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { BookingEntity } from './booking.entity';

@Entity('traveler')
export class TravelerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  // One-to-One
  @OneToOne(() => ProfileEntity, (profile) => profile.traveler, { cascade: true })
  @JoinColumn()
  profile: ProfileEntity;

  // One-to-Many
  @OneToMany(() => BookingEntity, (booking) => booking.traveler, { cascade: true })
  bookings: BookingEntity[];
}
