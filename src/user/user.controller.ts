import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async createUser(
    @Body() body: { email: string; password: string },
  ): Promise<string> {
    const newUser = await this.authService.create(body);
    return this.authService.login(newUser);
  }

  @Post('login')
  findOne(@Body() body: { email: string; password: string }): Promise<string> {
    return this.authService.login(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
