import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({cmd:'auth.register.user'})
  register(){
    return 'Registrado'
  }

  @MessagePattern({cmd:''})
  login(){

  }

  @MessagePattern({cmd:''})
  verify(){
    
  }
}

