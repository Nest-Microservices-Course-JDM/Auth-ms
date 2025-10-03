import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client'
//IMPORTAMOS BCRYPT
import * as bcrypt from 'bcrypt';

import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/interfaces/jwt-payload.interface';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('AuthService')

    constructor(
        private readonly jwtService: JwtService //Hacemos uso del JWT service
    ){
        super(); //Por cuestión del extends
    }

    //Conexión a la base de datos de mongoDB
    onModuleInit() {
        this.$connect();
        this.logger.log('MongoDB connected')
    }

    //Se debe tipar estrictamente el payload de firma para el jwt
    //JwtPayload es una interface
    async signJWT(payload: JwtPayload){
        return this.jwtService.sign(payload);
    }

    async verifyToken(token: string){
        try {
            //Si el token no tiene una firma basada en el secret de los envs no se va a aceptar
            const {sub, iat, exp, ...user} = this.jwtService.verify(token, {
                secret: envs.jwtSecret,
            });

            return {
                user: user,
                token: await this.signJWT(user)
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: 'Invalid Token'
            })
        }
    }


    async registerUser(registerUserDto: RegisterUserDto) {
        const {email, password, name} = registerUserDto;

        //Primero verificar si ya existe el usuario que se intenta crear
        try {
            const user = await this.user.findUnique({
                where: {email}
            })

            if(user){
                throw new RpcException({
                    status: 400,
                    message: "User already exist"
                })
            }

           //En caso de que no exista, se crea el usuario 
            const newUser = await this.user.create({
                data: {
                    email: email,
                    //Hasheamos la contraseña con bcrypt
                    password: bcrypt.hashSync(password,10),
                    name: name,
                }
            })

            //Para retornar no retornar la contraseña -->
            const {password: __, ...rest} = newUser
            
            //Hacemos uso de la función de firma del JWT con el "rest" que sería la información del usuario
            return {
                user: rest,
                token: await this.signJWT(rest)
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }


    async loginUser(loginUserDto: LoginUserDto) {
        const {email, password} = loginUserDto;

        //Primero verificar si ya existe el usuario que se intenta crear
        try {
            const user = await this.user.findUnique({
                where: {email}
            })

            //Si el usuario no existe se retorna un string poco descriptivo
            if(!user){
                throw new RpcException({
                    status: 400,
                    message: "Invalid credentials - Us"
                })
            }

           //Se verifica la contraseña
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            
            /*En caso de que no hagan match, las contraseña, tanto la que llega como la que está
            guardada en la BD, lanzamos un error
            */
            if(!isPasswordValid){
                throw new RpcException({
                    status: 400,
                    message: 'Invalid credentials - Pass'
                })
            }

            //Para retornar no retornar la contraseña -->
            const {password: __, ...rest} = user
            
            return {
                user: rest,
                token: await this.signJWT(rest)
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
}
