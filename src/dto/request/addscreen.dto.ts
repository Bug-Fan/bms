import { IsInt, IsNotEmpty } from "class-validator";

export class AddScreenDTO {

  @IsNotEmpty()
  screenName: string;

  @IsInt()
  maxCapacity: number;
}