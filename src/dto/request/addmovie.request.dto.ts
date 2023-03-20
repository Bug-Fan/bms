import { IsNotEmpty, IsPositive, IsString, IsUrl } from "class-validator";

export class AddMovieDto {
  @IsString()
  @IsNotEmpty()
  movieName: string;

  @IsString()
  @IsNotEmpty()
  movieDescription: string;

  @IsPositive()
  movieDuration: number;

  @IsString()
  movieLanguage: string;
  
  @IsString()
  movieGenre: string;
  
  @IsUrl()
  movieImdbLink: string;
}