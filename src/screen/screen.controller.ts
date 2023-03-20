import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserRoles } from "src/db/user.role";
import { AddMovieDto } from "src/dto/request/addmovie.request.dto";
import { AddScreenDTO } from "src/dto/request/addscreen.dto";
import { AddMovieResponseDto } from "src/dto/response/add.movie.response.dto";
import { AddScreenResponsedto } from "src/dto/response/addscreenresponse.dto";
import { RoleGuard } from "src/guards/role.guard";
import { ScreenService } from "./screen.service";

@ApiTags("Screen")
@ApiBearerAuth()
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

  @UseGuards(AuthGuard("jwt"), new RoleGuard(UserRoles.admin))
  @Post("movie")
  @ApiBody({ type: AddMovieDto })
  @ApiCreatedResponse({
    type: AddMovieResponseDto,
    description: "Movie added.",
  })
  @ApiBadRequestResponse({
    description: "Cannot add movie.",
  })
  addMovie(@Body() addMovieDTo: AddMovieDto) {
    return this.screenService.addMovie(addMovieDTo);
  }
}
