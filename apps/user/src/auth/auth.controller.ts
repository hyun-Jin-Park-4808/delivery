import { RpcInterceptor } from '@app/common';
import {
  Controller,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ParseBearerTokenDto } from './dto/parse-bearer-token.dto';
import { RegisterDto } from './dto/register-dto';
import { UserMicroService } from '@app/common';

@Controller('auth')
export class AuthController implements UserMicroService.AuthService {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // registerUser(
  //   @Authorization() token: string,
  //   @Body() registerDto: RegisterDto,
  // ) {
  //   if (token === null) {
  //     throw new UnauthorizedException('토큰을 입력해주세요!');
  //   }

  //   return this.authService.register(token, registerDto);
  // }

  // @Post('login')
  // @UsePipes(ValidationPipe)
  // loginUser(@Authorization() token: string) {
  //   if (token === null) {
  //     throw new UnauthorizedException('토큰을 입력해주세요!');
  //   }

  //   return this.authService.login(token);
  // }

  // @MessagePattern({
  //   cmd: 'parse_bearer_token',
  // }) // 응답을 줄 수 있다., @EventPattern() 이벤트를 던지기만 한다.
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  parseBearerToken(payload: UserMicroService.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(payload.token, false);
  }

  // @MessagePattern({
  //   cmd: 'register',
  // })
  registerUser(registerDto: UserMicroService.RegisterUserRequest) {
    const { token } = registerDto;
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }

    return this.authService.register(token, registerDto);
  }

  // @MessagePattern({
  //   cmd: 'login',
  // })
  loginUser(loginDto: UserMicroService.LoginUserRequest) {
    const { token } = loginDto;
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }

    return this.authService.login(token);
  }
}
