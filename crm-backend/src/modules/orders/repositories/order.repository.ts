import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_STATUS } from 'src/common/enums/order.enum';
import { RangeResult } from 'src/utils';
const SEVEN_HOURS = 7 * 60 * 60 * 1000;
export class OrderRepository {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
  ) {}
  async getOrderOverview(fromDate: string, toDate: string) {
    return this.orderModel.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: {
            $gte: new Date(
              new Date(fromDate).setHours(0, 0, 0, 0) - SEVEN_HOURS,
            ),
            $lt: new Date(new Date(toDate).setHours(24, 0, 0, 0) - SEVEN_HOURS),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$status', ORDER_STATUS.COMPLETED] },
                '$totalAmount',
                0,
              ],
            },
          },
          completedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', ORDER_STATUS.COMPLETED] }, 1, 0],
            },
          },
          completedAmount: {
            $sum: {
              $cond: [
                { $eq: ['$status', ORDER_STATUS.COMPLETED] },
                '$totalAmount',
                0,
              ],
            },
          },
          inProgressCount: {
            $sum: {
              $cond: [
                {
                  $in: [
                    '$status',
                    [ORDER_STATUS.PROCESSING, ORDER_STATUS.PENDING],
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $project: { _id: 0 } },
    ]);
  }

  async getRevenueSeries(data: RangeResult) {
    const { toDate, values, unit } = data;
    const tz = 'Asia/Ho_Chi_Minh';
    const to = new Date(toDate);
    const [doc] = await this.orderModel
      .aggregate<{ result: Array<{ bucket: number; revenue: number }> }>([
        {
          $match: {
            isDeleted: false,
            status: ORDER_STATUS.COMPLETED,
            ...(unit === 'year'
              ? { createdAt: { $gte: new Date(to.getFullYear() - 5, 0, 1) } }
              : {}),
          },
        },
        {
          $set: {
            anchor: {
              $dateTrunc: {
                date: {
                  $dateSubtract: {
                    startDate: to,
                    unit,
                    amount: values - 1,
                    timezone: tz,
                  },
                },
                unit,
                timezone: tz,
              },
            },
            upperBoundExclusive: {
              $dateAdd: {
                startDate: { $dateTrunc: { date: to, unit, timezone: tz } },
                unit,
                amount: 1,
                timezone: tz,
              },
            },
          },
        },

        {
          $match: {
            $expr: {
              $and: [
                { $gte: ['$createdAt', '$anchor'] },
                { $lt: ['$createdAt', '$upperBoundExclusive'] },
              ],
            },
          },
        },
        {
          $addFields: {
            bucket: {
              $dateDiff: {
                startDate: '$anchor',
                endDate: '$createdAt',
                unit,
                timezone: tz,
              },
            },
          },
        },
        { $match: { bucket: { $gte: 0, $lt: values } } },

        { $group: { _id: '$bucket', revenue: { $sum: '$totalAmount' } } },

        {
          $group: {
            _id: null,
            kv: { $push: { k: { $toString: '$_id' }, v: '$revenue' } },
          },
        },
        { $project: { _id: 0, map: { $arrayToObject: '$kv' } } },
        {
          $project: {
            result: {
              $map: {
                input: { $range: [0, values] },
                as: 'i',
                in: {
                  bucket: '$$i',
                  revenue: {
                    $ifNull: [
                      {
                        $getField: {
                          input: '$map',
                          field: { $toString: '$$i' },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
      ])
      .exec();
    return {
      result:
        (doc?.result as Array<{ bucket: number; revenue: number }>) ??
        Array.from({ length: values }, (_, i) => ({
          bucket: i,
          revenue: 0,
        })),
    };
  }
}
