import {
  MailerModule,
  MailerOptions,
  MAILER_OPTIONS,
} from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailController } from "./email.controller";
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
            service: "Gmail",
            auth: {
              user: configs.get<string>("GMAIL_USER"),
              pass: configs.get<string>("GMAIL_PASS"),
            },
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
  controllers: [EmailController],
  providers: [EmailService],
  exports:[EmailService]
})
export class EmailModule {}
