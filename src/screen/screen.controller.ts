import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserRoles } from "src/db/user.role";
import { AddScreenDTO } from "src/dto/request/addscreen.dto";
import { AddScreenResponsedto } from "src/dto/response/addscreenresponse.dto";
import { RoleGuard } from "src/guards/role.guard";
import { ScreenService } from "./screen.service";

@ApiTags("Screen")
@Controller("screen")
export class ScreenController {
  constructor(private screenService: ScreenService) {}

  @UseGuards(AuthGuard("jwt"), new RoleGuard(UserRoles.admin))
  @Post("add")
  @ApiBody({ type: AddScreenDTO })
  @ApiCreatedResponse({
    type: AddScreenResponsedto,
    description: "Screen added.",
  })
  @ApiBadRequestResponse({
    description: "Cannot add screen.",
  })
  addScreen(@Body() addScreenDTo: AddScreenDTO) {
    return this.screenService.addScreen(addScreenDTo);
  }
}
