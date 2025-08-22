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
            $lte: new Date(
              new Date(toDate).setHours(23, 59, 59, 999) - SEVEN_HOURS,
            ),
          },
        },
      },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalAmount: { $sum: '$totalAmount' },
              },
            },
            { $project: { _id: 0 } },
          ],
          completed: [
            {
              $group: {
                _id: null,
                count: {
                  $sum: {
                    $cond: [
                      { $in: ['$status', [ORDER_STATUS.COMPLETED]] },
                      1,
                      0,
                    ],
                  },
                },
                amount: {
                  $sum: {
                    $cond: [
                      { $in: ['$status', [ORDER_STATUS.COMPLETED]] },
                      '$totalAmount',
                      0,
                    ],
                  },
                },
              },
            },
            { $project: { _id: 0 } },
          ],
          inProgress: [
            {
              $group: {
                _id: null,
                count: {
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
          ],
        },
      },
      {
        $project: {
          totalOrders: {
            $ifNull: [{ $arrayElemAt: ['$totals.totalOrders', 0] }, 0],
          },
          totalRevenue: {
            $ifNull: [{ $arrayElemAt: ['$totals.totalAmount', 0] }, 0],
          },
          inProgressCount: {
            $ifNull: [{ $arrayElemAt: ['$inProgress.count', 0] }, 0],
          },
          completedCount: {
            $ifNull: [{ $arrayElemAt: ['$completed.count', 0] }, 0],
          },
          completedAmount: {
            $ifNull: [{ $arrayElemAt: ['$completed.amount', 0] }, 0],
          },
        },
      },
    ]);
  }

  async getChartData(data: RangeResult) {
    const { fromDate, toDate, values } = data;
    const from = new Date(new Date(fromDate).getTime());
    const to = new Date(new Date(toDate).getTime());
    console.log(from);
    console.log(to);
    return this.orderModel.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: {
            $gte: from,
            $lt: to,
          },
          status: { $in: [ORDER_STATUS.COMPLETED] },
        },
      },
      {
        $addFields: {
          totalMs: { $subtract: [to, from] },
          relMs: { $subtract: ['$createdAt', from] },
        },
      },
      {
        $addFields: {
          bucket: {
            $floor: {
              $multiply: [{ $divide: ['$relMs', '$totalMs'] }, values],
            },
          },
        },
      },
      {
        $group: {
          _id: '$bucket',
          totalProfit: { $sum: '$totalAmount' },
        },
      },
      {
        $facet: {
          buckets: [
            { $sort: { _id: 1 } },
            {
              $group: {
                _id: null,
                data: { $push: { bucket: '$_id', revenue: '$totalProfit' } },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          allBuckets: Array.from({ length: values }, (_, i) => i),
        },
      },
      {
        $project: {
          result: {
            $map: {
              input: '$allBuckets',
              as: 'i',
              in: {
                bucket: '$$i',
                revenue: {
                  $let: {
                    vars: {
                      found: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: { $arrayElemAt: ['$buckets.data', 0] },
                              as: 'd',
                              cond: { $eq: ['$$d.bucket', '$$i'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ['$$found.revenue', 0] },
                  },
                },
              },
            },
          },
        },
      },
    ]);
  }
}
