import { UserMicroService } from '@app/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcInterceptor } from '@app/common';

@Controller()
@UseInterceptors(GrpcInterceptor)
export class UserController implements UserMicroService.UserService {
  constructor(private readonly userService: UserService) {}

  // @MessagePattern({ cmd: 'get_user_info' })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  @GrpcMethod('UserService')
  getUserInfo(request: UserMicroService.GetUserInfoRequest) {
    return this.userService.getUserById(request.userId);
  }
}
