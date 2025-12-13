import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/admin.dto';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'yaobo20030902';

@Injectable()
export class AdminService {
  constructor() {}

  // 管理员登录
  login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
    }
    return {
      message: '登录成功',
      token: 'admin-token',
    };
  }
}
