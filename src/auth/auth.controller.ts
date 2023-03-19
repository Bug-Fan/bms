import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserDto } from "src/dto/request/user.dto";
import { LoginResponseDto } from "src/dto/response/login.response.dto";
import { RegistrationResponseDto } from "src/dto/response/registration.response.dto";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@UseInterceptors(LoggingInterceptor)
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiBody({ type: UserDto })
  @ApiCreatedResponse({
    type: RegistrationResponseDto,
    description: "Registration successful.",
  })
  @ApiConflictResponse({
    description: "User already registered.",
  })
  @ApiBadRequestResponse({ description: "Unable to register." })
  async registerUser(
    @Body() registerUserDto: UserDto
  ): Promise<RegistrationResponseDto> {
    return await this.authService.registerUser(registerUserDto);
  }

  @Post("login")
  @ApiBody({ type: UserDto })
  @ApiOkResponse({ type: LoginResponseDto, description: "Login successful." })
  @ApiBadRequestResponse({ description: "Invalid username or password." })
  @ApiNotFoundResponse({ description: "User not found." })
  async loginUser(@Body() loginUserDto: UserDto): Promise<LoginResponseDto> {
    return await this.authService.loginUser(loginUserDto);
  }
}
