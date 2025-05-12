import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async createUser(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      _id: string;
    },
    @Req() req: any,
    @Res() res: Response,
    @Session() session: Record<string, string>,
  ): Promise<Response> {
    await this.authService.create(body);
    const user = await this.authService.login(body, req);
    const hashedEmail = crypto
      .createHash('sha256')
      .update(user.email)
      .digest('hex');
    const hashedCookie = `${hashedEmail}.${user._id}`;
    res.cookie('cookie', hashedCookie, { httpOnly: true }); // use secure:true for production
    session[hashedCookie] = JSON.stringify(user);
    return res.send({
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user._id,
    });
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string; _id: string },
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: Record<string, string>,
  ): Promise<void> {
    const user = await this.authService.login(body, req);
    const hashedEmail = crypto
      .createHash('sha256')
      .update(user.email)
      .digest('hex');
    const hashedCookie = `${hashedEmail}.${user._id}`;
    res.cookie('cookie', hashedCookie, { httpOnly: true }); // use secure:true for production
    session[hashedCookie] = JSON.stringify(user);
    res.send('Logged in');
  }

  @Get('user')
  async getUser(
    @Req() req: Request,
    @Session() session: Request<string, string>,
    @Res() res: Response,
  ): Promise<Response> {
    /**
     * todo Remove cookies code and replace with token
     */
    const cookie = req.cookies.cookie;
    const sessionUser = JSON.parse(session[cookie]);
    return res.send({
      firstName: sessionUser.firstName,
      lastName: sessionUser.lastName,
      userId: sessionUser._id,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
