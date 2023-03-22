import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserDto } from "../dto/request/user.dto";
import { DataSource } from "typeorm";
import { genSalt, hash, compare } from "bcrypt";
import { RegistrationResponseDto } from "../dto/response/registration.response.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginResponseDto } from "../dto/response/login.response.dto";
import { UserRoles } from "../db/user.role";
import { User } from "../db/entities/user.entity";
import { EmailResponse, EmailService, EmailSubjects } from "../email/email.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject("DataSource") private dataSource: DataSource,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async registerUser(
    registerUserDto: UserDto
  ): Promise<RegistrationResponseDto> {
    const { userEmail } = registerUserDto;
    let { userPassword } = registerUserDto;

    try {
      const salt = await genSalt();
      userPassword = await hash(userPassword, salt);

      const role = UserRoles.user;
      await this.dataSource.manager.insert(User, {
        userEmail,
        userPassword,
        role,
      });
      
      this.emailService.send({
        toEmail: userEmail,
        subject: EmailSubjects.REGISTER_SUCCESS,
        responseHBS: EmailResponse.REGISTER_SUCCESS,
        customObject: { email: userEmail },
      });

      const userResponse = new RegistrationResponseDto(
        true,
        "Registration successful"
      );

      return userResponse;
    } catch (error) {
      if (error.code && error.code == 23505)
        throw new ConflictException("You are already registered! Please login");
      else throw new BadRequestException("Unable to register you");
    }
  }

  async loginUser(loginUserDto: UserDto): Promise<LoginResponseDto> {
    const { userEmail, userPassword } = loginUserDto;
    let user: User;

    try {
      user = await this.dataSource.manager.findOneBy(User, { userEmail });
    } catch (e) {
      throw new BadRequestException("Unable to login you");
    }

    if (user) {
      const { userId, role } = user;
      if (await compare(userPassword, user.userPassword)) {
        const token: string = await this.jwtService.signAsync({
          userId,
          role,
        });
        return new LoginResponseDto(true, "Login Successful", token);
      } else throw new BadRequestException("Invalid username or password");
    } else throw new NotFoundException("User not found");
  }
}
