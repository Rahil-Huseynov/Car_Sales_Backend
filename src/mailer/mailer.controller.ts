import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('send-email')
export class MailerController {
    constructor(private readonly mailerService: MailerService) { }

    @Post()
    async sendEmail(@Body() body: { to: string; subject: string; text: string }) {
        try {
            await this.mailerService.sendMail(body.to, body.subject, body.text);
            return { message: 'Email uğurla göndərildi' };
        } catch (error) {
            return { message: 'Xəta baş verdi', error: error.message };
        }
    }
}
