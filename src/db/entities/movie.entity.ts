import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Show } from './show.entity';

@Entity()
export class Movie {
  @OneToMany(() => Show, (k) => k.movieId)
  @PrimaryGeneratedColumn('uuid')
  movieId: number;

  @Column()
  movieName: string;

  @Column()
  movieDescription: string;

  @Column({ type: 'numeric', default: 1 })
  movieDuration: number;

  @Column()
  movieLanguage: string;

  @Column()
  movieGenre: string;

  @Column()
  movieImdbLink: string;
}
