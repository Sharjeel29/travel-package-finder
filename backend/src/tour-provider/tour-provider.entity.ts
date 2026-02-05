import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class TourProvider {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column({ length: 150 })
  uniqueId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joiningDate: Date;

  @Column({ length: 30, default: 'Unknown' })
  country: string;

  @BeforeInsert()
  generateUUID() {
    this.uniqueId = uuid();
  }
}
