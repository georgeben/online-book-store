import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  loginUser() {
    return {
      message: 'Logged in successfully',
    };
  }

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  async signup(@Body() signupDto: SignUpDto) {
    const user = await this.authService.signup(signupDto);
    return {
      message: 'Successfully created account',
      user,
    };
  }

  @Post('logout')
  logout(@Req() req) {
    req.session.destroy();
    return {
      message: 'Successfully logged out',
    };
  }
}
