import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SearchShowDTO {
  @IsNotEmpty()
  @IsString()
  movieName: string
}