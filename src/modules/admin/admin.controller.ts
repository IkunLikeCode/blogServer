import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/admin.dto';

@UsePipes(ValidationPipe)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  // 管理员登录
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    try {
      return this.adminService.login(loginDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
