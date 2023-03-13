import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Booking } from "./booking.entity";
import { Movie } from "./movie.entity";
import { Screen } from "./screen.entity";
import { Slot } from "./slot.entity";

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

  @Column({ type: "date" })
  show_date: Date;

  @ManyToOne(() => Slot, (u) => u.slotId)
  @JoinColumn({ name: "slotId" })
  slot: Slot;
  @Column()
  slotId: number;

  @Column({ type: "numeric" })
  price: number;

  @Column()
  availableSeats: number;
}
