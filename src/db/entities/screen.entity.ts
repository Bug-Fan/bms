import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Show } from './show.entity';

@Entity()
export class Screen {
  @OneToMany(() => Show, (k) => k.screenId)
  @PrimaryGeneratedColumn()
  screenId: number;

  @Column()
  screenName: string;

  @Column({ type: 'numeric', default: 500, scale: 0, precision: 3 })
  maxCapacity: number;
}
