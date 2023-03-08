import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  requestId: number;

  @Column()
  host: string;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'text' })
  query: string;

  @ManyToOne(() => User, (u) => u.userId, { nullable: true })
  @JoinColumn({ name: 'requestBy' })
  userId: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ nullable: true, default: null })
  response: string;
}
