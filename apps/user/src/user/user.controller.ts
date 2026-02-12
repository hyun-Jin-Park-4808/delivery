import { RpcInterceptor, UserMicroService } from '@app/common';
import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController implements UserMicroService.UserService {
  constructor(private readonly userService: UserService) {}

  // @MessagePattern({ cmd: 'get_user_info' })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  getUserInfo(data: UserMicroService.GetUserInfoRequest) {
    return this.userService.getUserById(data.userId);
  }
}
