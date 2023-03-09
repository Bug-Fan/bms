import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsNumber, IsUUID, Validate, ValidationArguments, ValidatorConstraintInterface } from "class-validator";

export class AddShowDTO {
  
  @IsUUID()
  movieId: string;

  @IsNumber()
  screenId: number;

  @IsNumber()
  slotId: number;

  @Transform((o) => {
    let date = new Date(o.value)
    if (date < new Date())
      throw new BadRequestException('Date should be latest')
    else
      return date;
  })
  @IsDate()
  date: Date;

  @IsNumber()
  price: number;
}