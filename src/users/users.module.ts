import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CustomerRepository } from './repository/customer.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  providers: [UsersService, CustomerRepository],
  exports: [UsersService, CustomerRepository],
})
export class UsersModule {}
