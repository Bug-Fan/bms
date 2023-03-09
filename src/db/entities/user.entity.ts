import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from '../user.role';
import { Booking } from './booking.entity';
import { Log } from './log.entity';

@Entity()
export class User {
  @OneToMany(() => Log, (k) => k.userId)
  @OneToMany(() => Booking, (k) => k.userId)
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true, length: 100 })
  userEmail: string;

  @Column({ length: 100 })
  userPassword: string;

  @Column()
  role: UserRoles;
}
