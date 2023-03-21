import { Controller, Get } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { EmailService, EmailSubjects, MyMailOptions } from "./email.service";
@Controller("email")
export class EmailController {
  constructor(private emailService: EmailService) {}
 
  @Get("send")
  async sendEmail() {
   await this.emailService.send(
      new MyMailOptions(
        "grabopportunity82@gmail.com",
        EmailSubjects.BOOKING_SUCCESS,
        {
            Booking_id: 'hello booking id',
            seats:[1,2,3]
        }
      )
    );
  }
}

