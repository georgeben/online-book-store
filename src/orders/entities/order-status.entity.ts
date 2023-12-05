import {
  Column,
  Table,
  Model,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export class OrderStatus extends Model<OrderStatus> {
  @AllowNull(false)
  @Column
  name: string;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;
}
