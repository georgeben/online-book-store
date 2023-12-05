import { ConflictException, Injectable } from '@nestjs/common';
import { CustomerRepository } from './repository/customer.repository';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async createCustomer(signupDto: SignUpDto) {
    const accountExists = await this.customerRepository.findByEmail(
      signupDto.email,
    );
    if (accountExists) {
      throw new ConflictException('Email already exists');
    }
    return this.customerRepository.create(signupDto);
  }
}
