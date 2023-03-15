import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "./booking.entity";

@Entity()
export class Refund {
  @PrimaryGeneratedColumn('uuid')
  refundId: string;

  @OneToOne(() => Booking, (u) => u.bookingId)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;
  @Column()
  bookingId: string;

  @Column('boolean', { default: false })
  refundStatus: boolean;
}