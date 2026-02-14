import { UserMicroService } from '@app/common';
import {
  Controller,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { GrpcInterceptor } from '@app/common';

@Controller('auth')
@UseInterceptors(GrpcInterceptor)
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
  @GrpcMethod('AuthService')
  parseBearerToken(request: UserMicroService.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(request.token, false);
  }

  // @MessagePattern({
  //   cmd: 'register',
  // })
  @GrpcMethod('AuthService')
  registerUser(request: UserMicroService.RegisterUserRequest) {
    const { token } = request;
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }

    return this.authService.register(token, request);
  }

  // @MessagePattern({
  //   cmd: 'login',
  // })
  @GrpcMethod('AuthService')
  loginUser(request: UserMicroService.LoginUserRequest, metadata: Metadata) {
    const { token } = request;
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }

    return this.authService.login(token);
  }
}
