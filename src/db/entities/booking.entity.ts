import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Show } from "./show.entity";
import { User } from "./user.entity";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  bookingId: string;

  @ManyToOne(() => User, (u) => u.userId)
  @JoinColumn({ name: "userId" })
  userId: string;

  @ManyToOne(() => Show, (u) => u.showId)
  @JoinColumn({ name: "showId" })
  showId: string;

  @Column("numeric", { array: true, default: [] })
  seats: number[];

  @Column("boolean")
  paymentStatus: boolean;
}
