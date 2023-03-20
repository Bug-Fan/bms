import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import { AddShowDTO } from "src/dto/request/addShow.dto";

export class DateValidate implements PipeTransform {
  transform(value: AddShowDTO, metadata: ArgumentMetadata) {
    let startDateTime = new Date(value.startDateTime);
    let endDateTime = new Date(value.endDateTime);

    if (startDateTime < new Date()) {
      throw new BadRequestException("Startdate must be future date");
    } else if (startDateTime > endDateTime) {
      throw new BadRequestException("StartDate should less than EndDate");
    }
    return value;
  }
}
