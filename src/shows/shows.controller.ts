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
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AvailableSeatDto } from 'src/dto/request/availableseat.dto';

@ApiTags("Shows")
@Controller("shows")
export class ShowsController {
  constructor(private showService: ShowsService) {}
  
  @UseGuards(AuthGuard("jwt"), new RoleGuard(UserRoles.admin))
  @UsePipes(new DateValidate())
  @Post("add")
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: AddShowResponse,
    description: "show added.",
  })
  @ApiBadRequestResponse({
    description: "Screen not available. or slot already has show. or movie not found.",
  })
  addShow(@Body() show: AddShowDTO): Promise<AddShowResponse> {
    return this.showService.addShow(show);
  }

  @Get("get")
  @ApiOkResponse({
    type: SearchShowDTO,
    description: "shows listed.",
  })
  @ApiNotFoundResponse({
    description: "No show found.",
  })
  getShows(@Query() movieDTO: SearchShowDTO) {
    return this.showService.getShows(movieDTO);
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(UserRoles.admin))
  @Delete("cancel")
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CancelShowDto,
    description: "shows canceled.",
  })
  @ApiNotFoundResponse({
    description: "Show not found or already cancelled.",
  })
  @ApiBadRequestResponse({description: 'Unable to cancel show'})
  cancelShow(@Query() cancelShowDto: CancelShowDto) {
    return this.showService.cancelShow(cancelShowDto);
  }

  @Get("availableSeats")
  @ApiOkResponse({
    type: CancelShowDto,
    description: "shows canceled.",
  })
  @ApiNotFoundResponse({
    description: "Show not found.",
  })
  getSeats(@Query() availseatDto: AvailableSeatDto) {
    return this.showService.getAvailableSeats(availseatDto);
  }
}
