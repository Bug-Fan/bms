import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { AddShowDTO } from "src/dto/request/addShow.dto";

export class DateValidate implements PipeTransform{
    transform(value: AddShowDTO, metadata: ArgumentMetadata) {
       let startDateTime = value.startDateTime;
       let endDateTime = value.endDateTime;
       
       if(new Date(startDateTime) < new Date()){
        throw new BadRequestException("Startdate must be future date");
       }
       else if(new Date(startDateTime) > new Date(endDateTime) ){
        throw new BadRequestException("StartDate should less than EndDate")
       }
       else
        return value;
    }

}