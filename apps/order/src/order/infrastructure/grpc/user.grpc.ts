import { Inject, OnModuleInit } from '@nestjs/common';
import { UserOutputPort } from '../../port/output/user.output-port';
import { USER_SERVICE, UserMicroService } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CustomerEntity } from '../../domain/customer.entity';
import { lastValueFrom } from 'rxjs';
import { GetUserInfoResponseMapper } from './mapper/get-user-info-response.mapper';

export class UserGrpc implements UserOutputPort, OnModuleInit {
  userClient: UserMicroService.UserService;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userClient =
      this.userMicroService.getService<UserMicroService.UserService>(
        'UserService',
      );
  }

  async getUserById(userId: string): Promise<CustomerEntity> {
    const resp = (await lastValueFrom(
      this.userClient.getUserInfo({ userId }) as any,
    )) as UserMicroService.GetUserInfoResponse;

    return new GetUserInfoResponseMapper(resp).toDomain();
  }
}
