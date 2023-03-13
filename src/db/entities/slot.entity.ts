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
  // @OneToMany(() => Show, (k) => k.slotId)
  @PrimaryGeneratedColumn()
  slotId: number;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  finishTime: string;
}
