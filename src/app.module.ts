import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, EmailModule, CommonModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
