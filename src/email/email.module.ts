import {
  MailerModule,
  MailerOptions,
  MAILER_OPTIONS,
} from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EmailService } from "./email.service";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configs: ConfigService): Promise<MailerOptions> => {
        return {
          transport: {
            host: configs.get<string>("EMAIL_HOST"),
            auth: {
              user: configs.get<string>("SENDING_USER"),
              pass: configs.get<string>("SENDING_PASS"),
            },
            secure: true,
          },
          template: {
            dir: join(__dirname, "mail_templates"),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],

  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
