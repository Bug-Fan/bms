import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Movie } from './movie.entity';
import { Screen } from './screen.entity';

@Entity()
export class Show {
  @OneToMany(() => Booking, (k) => k.showId)
  @PrimaryGeneratedColumn("uuid")
  showId: string;

  @ManyToOne(() => Movie, (u) => u.movieId)
  @JoinColumn({ name: "movieId" })
  movie: Movie;
  
  @Column()
  movieId: string;

  @ManyToOne(() => Screen, (u) => u.screenId)
  @JoinColumn({ name: "screenId" })
  screen: Screen;
  @Column()
  screenId: number;

  @Column({ type: "timestamptz", precision: 3 })
  startDateTime: Timestamp;

  @Column({ type: "timestamptz", precision: 3 })
  endDateTime: Timestamp;

  @Column({ type: "numeric" })
  price: number;

  @Column('integer', { array: true })
  availableSeats: number[];

  @Column('boolean', { default: true })
  isActive: boolean;
}
