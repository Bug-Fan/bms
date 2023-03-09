import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Show } from './show.entity';

@Entity()
export class Slot {
  @OneToMany(() => Show, (k) => k.slotId)
  @PrimaryGeneratedColumn()
  slotId: number;

  @Column({ type: 'time' })
  startTime: Timestamp;

  @Column({ type: 'time' })
  finishTime: Timestamp;
}
