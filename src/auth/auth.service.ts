import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import { CustomerRepository } from 'src/users/repository/customer.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async signup(signupDto: SignUpDto) {
    return this.userService.createCustomer(signupDto);
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.customerRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    const passwordMatch = await compare(loginDto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    return user;
  }
}
