import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { NotificationGateway } from './notification.gateway';
import * as nodemailer from 'nodemailer';

@Processor('notification-queue')
export class NotificationProcessor {
  private transporter: nodemailer.Transporter;

  constructor(private gateway: NotificationGateway) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  @Process('send-notification')
  async handleNotification(job: Job<any>) {
    const data = job.data;

    // Send real-time WebSocket notification
    this.gateway.sendToUser(data.receiverId, {
      type: data.type,
      message: data.message,
      senderId: data.senderId,
      postId: data.postId,
    });

    // Send email (only if SMTP is configured)
    if (process.env.SMTP_USER) {
      await this.sendEmail(data);
    }
  }

  private async sendEmail(data: any) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@app.com',
        to: data.receiverEmail,
        subject: 'New Notification',
        html: `<p>${data.message}</p>`,
      });
    } catch (error) {
      console.error('Email send failed:', error.message);
    }
  }
}
