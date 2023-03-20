import { Controller, Get, Post } from '@nestjs/common';
import { Body, Delete, Query, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles } from 'src/db/user.role';
import { AddShowDTO } from 'src/dto/request/addShow.dto';
import { SearchShowDTO } from 'src/dto/request/searchShow.dto';
import { AddShowResponse } from 'src/dto/response/addShowResponse.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { ShowsService } from './shows.service';
import { DateValidate } from '../pipes/dateValidation.pipe'
import { CancelShowDto } from 'src/dto/request/cancel.show.dto';
import { ApiTags } from '@nestjs/swagger';
import { AvailableSeatDto } from 'src/dto/request/availableseat.dto';

@ApiTags("Shows")
@Controller("shows")
export class ShowsController {
  constructor(private showService: ShowsService) {}

  @UseGuards(AuthGuard("jwt"), new RoleGuard(UserRoles.admin))
  @UsePipes(new DateValidate())
  @Post("add")
  addShow(@Body() show: AddShowDTO): Promise<AddShowResponse> {
    return this.showService.addShow(show);
  }

  @Get("get")
  getShows(@Query() movieDTO: SearchShowDTO) {
    return this.showService.getShows(movieDTO);
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(UserRoles.admin))
  @Delete("cancel")
  cancelShow(@Query() cancelShowDto: CancelShowDto) {
    return this.showService.cancelShow(cancelShowDto);
  }

  @Get("availableSeats")
  getSeats(@Query() availseatDto: AvailableSeatDto) {
    return this.showService.getAvailableSeats(availseatDto);
  }
}
