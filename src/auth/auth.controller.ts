import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from "@nestjs/swagger";
import { UserDto } from "src/dto/request/user.dto";
import { LoginResponseDto } from "src/dto/response/login.response.dto";
import { RegistrationResponseDto } from "src/dto/response/registration.response.dto";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { AuthService } from "./auth.service";

@ApiTags("auth")
@UseInterceptors(LoggingInterceptor)
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("register")
  @ApiBody({ type: UserDto })
  @ApiCreatedResponse({
    type: RegistrationResponseDto,
    description: "User Registered",
  })
  @ApiConflictResponse({ description: "You are already registered! Please login" })
  async registerUser(
    @Body() registerUserDto: UserDto
  ): Promise<RegistrationResponseDto> {
    return await this.authService.registerUser(registerUserDto);
  }

  @Post("login")
  @ApiBody({ type: UserDto })
  @ApiOkResponse({ type: LoginResponseDto, description: "Login Successful" })
  @ApiBadRequestResponse({ description: "Invalid username or password" })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiBadGatewayResponse({ description: "Unable to login" })
  async loginUser(@Body() loginUserDto: UserDto): Promise<LoginResponseDto> {
    return await this.authService.loginUser(loginUserDto);
  }
}
