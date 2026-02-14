import { constructMetadata, USER_SERVICE, UserMicroService } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: UserMicroService.AuthService;
  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.userMicroService.getService<UserMicroService.AuthService>(
        'AuthService',
      );
  }

  register(token: string, registerDto: RegisterDto) {
    return this.authService.registerUser(
      { ...registerDto, token },
      constructMetadata(AuthService.name, 'register'),
    );
  }

  login(token: string) {
    return this.authService.loginUser(
      { token },
      constructMetadata(AuthService.name, 'login'),
    );
  }
}
