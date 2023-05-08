import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  constructor(
    private mailservice: MailerService,
    private confService: ConfigService
  ) {}

  async send(mailOptions: MyMailOptions) {
    const { responseHBS, subject, toEmail, customObject } = mailOptions;
    let result = await this.mailservice.sendMail({
      from: 'notifications@bms.com',
      to: toEmail,
      subject,
      template: responseHBS,
      context: {
        data: customObject,
      },
    });
  }
}

export class MyMailOptions {
  toEmail: string;
  subject: EmailSubjects;
  responseHBS: EmailResponse;
  customObject: any;
  constructor(
    toEmail: string,
    subject: EmailSubjects,
    emailResponseHBS: EmailResponse,
    obj: any
  ) {
    this.toEmail = toEmail;
    this.subject = subject;
    this.responseHBS = emailResponseHBS;
    this.customObject = obj;
  }
}

export enum EmailSubjects {
  REGISTER_SUCCESS = "Registration",
  BOOKING_SUCCESS = "Booking Confirmation",
}

export enum EmailResponse {
  REGISTER_SUCCESS = "registration_response",
  BOOKING_SUCCESS = "booking_response",
}
