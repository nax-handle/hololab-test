import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ORDER_STATUS, ORDER_TYPE } from 'src/common/enums';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: String, enum: ORDER_TYPE, required: true })
  orderType: ORDER_TYPE;

  @Prop({ type: String, enum: ORDER_STATUS, default: ORDER_STATUS.PENDING })
  status: ORDER_STATUS;

  @Prop({ type: Number, default: 0 })
  totalAmount: number;

  @Prop()
  description?: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  completedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
