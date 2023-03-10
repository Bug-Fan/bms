import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { MaxDate, MinDate, IsDate, IsDateString, IsNumber, IsUUID, Validate, ValidationArguments, ValidatorConstraintInterface } from "class-validator";

export class AddShowDTO {

  @IsUUID()
  movieId: string;

  @IsNumber()
  screenId: number;

  @IsNumber()
  slotId: number;

  @Transform((o) => {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1)
    let date = new Date(o.value)
    if (date < currentDate)
      throw new BadRequestException('Date should be future date')
    else
      return date;
  })
  @IsDate()

  date: Date;

  @IsNumber()
  price: number;
}