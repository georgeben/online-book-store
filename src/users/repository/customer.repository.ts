import { InjectModel } from '@nestjs/sequelize';
import { Optional } from 'sequelize';
import { Customer } from '../entities/customer.entity';
import { hash } from 'bcrypt';
import { CustomerAttributes } from '../interfaces/customers.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectModel(Customer) private readonly customerModel: typeof Customer,
  ) {}

  async create(payload: Optional<CustomerAttributes, 'id'>): Promise<Customer> {
    const SALT_ROUNDS = 10;
    const password = await hash(payload.password, SALT_ROUNDS);
    const customer = await this.customerModel.create({
      ...payload,
      password,
    });
    return customer.toJSON();
  }

  findByEmail(email: string): Promise<Customer | null> {
    return this.customerModel.findOne({ where: { email } });
  }

  findById(id: number): Promise<Customer | null> {
    return this.customerModel.findOne({ where: { id } });
  }
}
