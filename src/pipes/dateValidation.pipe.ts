import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { start } from "repl";
import { AddShowDTO } from "src/dto/request/addShow.dto";

export class DateValidate implements PipeTransform{
    transform(value: AddShowDTO, metadata: ArgumentMetadata) {
       let startDateTime = value.startDateTime;
       let endDateTime = value.endDateTime;

       if(new Date(startDateTime) < new Date(endDateTime)){
        return value;
       }
       else{
        throw new BadRequestException("StartDate should less than EndDate")
       }
    }

}