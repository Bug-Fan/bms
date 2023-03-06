import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Log } from './log.entity';

@Entity()
export class User {
  @OneToMany(() => Log, (k) => k.userId)
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true, length: 100 })
  userEmail: string;

  @Column({ length: 100 })
  userPassword: string;
}
