import { constructMetadata, USER_SERVICE, UserMicroService } from '@app/common';
import { ParseBearerTokenResponse } from '@app/common/grpc/proto/user';
import {
  Inject,
  Injectable,
  NestMiddleware,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { NextFunction, Request, Response } from 'express';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware, OnModuleInit {
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
  async use(req: any, res: any, next: (error?: Error | any) => void) {
    // 1) raw token 가져오기
    const token = this.getRawToken(req);
    if (!token) {
      next();
      return;
    }

    // User Auth에 토큰 던지기
    const payload = await this.verifyToken(token);

    // 3) req.user payload 붙이기
    req.user = payload;

    next();
  }

  getRawToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    return authHeader;
  }

  async verifyToken(token: string) {
    const result = await lastValueFrom(
      this.authService.parseBearerToken(
        {
          token,
        },
        constructMetadata(BearerTokenMiddleware.name, 'verifyToken'),
      ) as unknown as Observable<ParseBearerTokenResponse>,
    );

    return result;
  }
}
