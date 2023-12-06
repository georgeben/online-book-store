import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Customer } from '@/users/entities/customer.entity';
import { CustomerRepository } from '@/users/repository/customer.repository';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly customerRepository: CustomerRepository) {
    super();
  }
  serializeUser(
    user: Customer,
    done: (err: Error, user: { email: string }) => void,
  ) {
    done(null, { email: user.email });
  }

  async deserializeUser(
    payload: { email: string },
    done: (err: Error, user: Customer) => void,
  ) {
    const user = await this.customerRepository.findByEmail(payload.email);
    done(null, user);
  }
}
