import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*Poner el pattern en un MessagePattern, significa que este microservicio
  está suscribiendose a {cmd:'auth.register.user}
  */
  @MessagePattern({cmd:'auth.register.user'})
  register(){
    return 'Registrado'
  }

  @MessagePattern({cmd:'auth.login.user'})
  login(){
    return 'Login'
  }

  @MessagePattern({cmd:'auth.verify.user'})
  verify(){
    return 'Verify'
  }
}

