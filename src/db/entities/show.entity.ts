import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Movie } from './movie.entity';
import { Screen } from './screen.entity';
import { Slot } from './slot.entity';

@Entity()
export class Show {
  @OneToMany(() => Booking, (k) => k.showId)
  @PrimaryGeneratedColumn('uuid')
  showId: string;

  @ManyToOne(() => Movie, (u) => u.movieId)
  @JoinColumn({ name: 'movieId' })
  movieId: string;

  @ManyToOne(() => Screen, (u) => u.screenId)
  @JoinColumn({ name: 'screenId' })
  screenId: number;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Slot, (u) => u.slotId)
  @JoinColumn({ name: 'slotId' })
  slotId: string;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  price: number;

  @Column()
  availableSeats: number;
}
