import Mail = require('nodemailer/lib/mailer');
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import * as uuid from 'uuid';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(private readonly prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendVerificationMail(email: string, token: string) {
    const emailVerified = await this.prisma.user.findUnique({
      where: { email, isEmailVerified: true },
    });
    if (emailVerified) {
      return { status: 'error', message: '이미 인증된 이메일입니다.' };
    }
    const clientUrl = process.env.CLIENT_URL;
    const url = `${clientUrl}/verification/${token}`;

    const mailOptions: EmailOptions = {
      to: email,
      subject: 'Money Buddy - 이메일 인증',
      html: `
            <div style="width: 100%; min-height: 1300px">
      <div
        style="
          text-align: center;
          width: 800px;
          margin: 30px auto;
          padding: 40px 80px;
          border: 1px solid #ededed;
          background: #fff;
          box-sizing: border-box;
        "
      >
          <img
            style="width: 150px"
            src="https://i.ibb.co/vxQ9by45/mail-logo.png"
            alt="logo"
          />
        <h1>Money Buddy</h1>
        <p
          style="
            padding-top: 20px;
            font-weight: 700;
            font-size: 20px;
            line-height: 1.5;
            color: #222;
          "
        >
          이메일 주소를 인증해주세요.
        </p>
        <p
          style="
            font-size: 16px;
            font-weight: 400;
            line-height: 1.5;
            margin-bottom: 40px;
            color: #6a7282;
          "
        >
          하단 버튼을 누르시면 이메일 인증이 완료됩니다.
        </p>
        <a href=${url} style="background: #404040;text-decoration: none;padding: 10px 24px;font-size: 18px;color: #fff;font-weight: 400;border-radius: 4px;">이메일 인증</a>
      </div>
    </div>
      `,
    };
    await this.transporter.sendMail(mailOptions);
    return { status: 'success', message: '이메일을 성공적으로 보냈습니다.' };
  }

  async findPasswordMail(email: string) {
    const token = uuid.v4();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { status: 'error', message: '가입된 이메일이 아닙니다.' };
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { verifyToken: token },
    });

    const clientUrl = process.env.CLIENT_URL;
    const url = `${clientUrl}/find-password/${token}`;

    const mailOptions: EmailOptions = {
      to: email,
      subject: 'Money Buddy - 비밀번호 변경',
      html: `
            <div style="width: 100%; min-height: 1300px">
      <div
        style="
          text-align: center;
          width: 800px;
          margin: 30px auto;
          padding: 40px 80px;
          border: 1px solid #ededed;
          background: #fff;
          box-sizing: border-box;
        "
      >
          <img
            style="width: 150px"
            src="https://i.ibb.co/vxQ9by45/mail-logo.png"
            alt="logo"
          />
        <h1>Money Buddy</h1>
        <p
          style="
            padding-top: 20px;
            font-weight: 700;
            font-size: 20px;
            line-height: 1.5;
            color: #222;
          "
        >
          비밀번호 변경 안내
        </p>
        <p
          style="
            font-size: 16px;
            font-weight: 400;
            line-height: 1.5;
            margin-bottom: 40px;
            color: #6a7282;
          "
        >
          하단 버튼을 누르시면 비밀번호 변경 페이지로 이동합니다.
        </p>
        <a href=${url} style="background: #404040;text-decoration: none;padding: 10px 24px;font-size: 18px;color: #fff;font-weight: 400;border-radius: 4px;">비밀번호 변경</a>
      </div>
    </div>
      `,
    };
    await this.transporter.sendMail(mailOptions);
    return {
      status: 'success',
      message:
        '비밀번호 변경 메일을 전송하였습니다. 메일을 통해 계속 진행해주세요.',
    };
  }
}
