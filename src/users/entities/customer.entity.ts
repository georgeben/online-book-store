import { Exclude } from 'class-transformer';
import {
  Column,
  CreatedAt,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export class Customer extends Model<Customer> {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Unique
  @Column
  email: string;

  @Column
  @Exclude()
  password: string;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;

  toJSON() {
    const data = this.get();
    delete data.password;
    return data;
  }
}
