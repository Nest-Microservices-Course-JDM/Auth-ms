import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'
import { envs } from 'src/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  //Como vamos a inyectar un servicio debemos importarlo en el módulo correspondiente
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: {expiresIn: '2h'}
    })
  ]
})
export class AuthModule {}
