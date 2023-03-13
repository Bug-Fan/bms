import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Screen } from "src/db/entities/screen.entity";
import { Show } from "src/db/entities/show.entity";
import { AddScreenDTO } from "src/dto/request/addscreen.dto";
import { AddScreenResponsedto } from "src/dto/response/addscreenresponse.dto";
import { DataSource } from "typeorm";

@Injectable()
export class ScreenService {
  constructor(@Inject("DataSource") private dataSource: DataSource) {}

  async addScreen(ScreenDTO: AddScreenDTO) {
    try {
      let screen = await this.dataSource.manager.insert(Screen, {
        maxCapacity: ScreenDTO.maxCapacity,
        screenName: ScreenDTO.screenName,
      });
      return new AddScreenResponsedto(
        true,
        `Screen ${ScreenDTO.screenName} added`
      );
    } catch (e) {
      throw new BadRequestException("Cannot add new screen.");
    }
  }
}
