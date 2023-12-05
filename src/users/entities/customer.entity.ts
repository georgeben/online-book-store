import { Exclude } from 'class-transformer';
import {
  AllowNull,
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
  @AllowNull(false)
  @Column
  firstName: string;

  @AllowNull(false)
  @Column
  lastName: string;

  @AllowNull(false)
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
