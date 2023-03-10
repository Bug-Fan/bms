import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { MaxDate, MinDate, IsDate, IsDateString, IsNumber, IsUUID, Validate, ValidationArguments, ValidatorConstraintInterface, IsInt, IsIn } from "class-validator";

export class AddShowDTO {

  @ApiProperty({
    name:'movieId',
    description:'Id of movie to added in show',
    type:'uuid',
    required:true
  })
  @IsUUID()
  movieId: string;

  @ApiProperty({
    name:'screenId',
    description:'Id of screen which will display show',
    type:'integer',
    required:true
  })

  @IsInt()
  @IsNumber()
  screenId: number;

  @ApiProperty({
    name:'slotID',
    description:'Id of slot in which show will be shown',
    type:'integer',
    required:true
  })
  @IsInt()
  @IsNumber()
  slotId: number;

  @ApiProperty({
    name:'date',
    description:'date on which the movie will be shown',
    type:'date',
    required:true
  })
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

  @ApiProperty({
    name:'price',
    description:'Price of the ticket',
    type:'number',
    required:true
  })
  @IsNumber()
  price: number;
}