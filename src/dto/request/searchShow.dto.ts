import { IsOptional, IsString } from "class-validator";

export class SearchShowDTO{

  @IsString()
  movieName:string

}