import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices'
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*Poner el pattern en un MessagePattern, significa que este microservicio
  está suscribiendose a {cmd:'auth.register.user}
  */
  @MessagePattern({cmd:'auth.register.user'})
  register(@Payload() registerUserDto: RegisterUserDto){
    return this.authService.registerUser(registerUserDto);
  }

  @MessagePattern({cmd:'auth.login.user'})
  login(@Payload() loginUserDto: LoginUserDto){
    return this.authService.loginUser(loginUserDto);
  }

  @MessagePattern({cmd:'auth.verify.user'})
  verify(@Payload() token: string){
    return this.authService.verifyToken(token)
  }
}

