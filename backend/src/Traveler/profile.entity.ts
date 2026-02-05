import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { TravelerEntity } from './traveler.entity';

@Entity('profile')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  dob: string;

  @Column({ nullable: true })
  bio: string;

  @OneToOne(() => TravelerEntity, (traveler) => traveler.profile)
  traveler: TravelerEntity;
}
