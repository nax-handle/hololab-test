import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_STATUS } from 'src/common/enums/order.enum';

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
          createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
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

  async getChartData(
    range: '1D' | '7D' | '1M' | '1Y' | 'ALL',
    fromDate?: string,
    toDate?: string,
  ) {
    const bucketCounts = {
      '1D': 6, // 6 slots of 4 hours each
      '7D': 7, // 7 days
      '1M': 30, // 30 days
      '1Y': 12, // 12 months
      ALL: 0, // dynamic based on years
    };

    if (range !== 'ALL' && (!fromDate || !toDate)) {
      throw new Error('fromDate and toDate are required for 1D/7D/1M/1Y');
    }

    interface MatchFilter {
      isDeleted: boolean;
      createdAt?: { $gte: Date; $lt: Date };
    }

    const baseMatch: MatchFilter = {
      isDeleted: false,
    };

    if (range !== 'ALL') {
      baseMatch.createdAt = {
        $gte: new Date(fromDate!),
        $lt: new Date(toDate!),
      };
    }

    if (range === 'ALL') {
      // Return revenues by year
      const result = await this.orderModel.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: { $year: '$createdAt' },
            revenue: { $sum: '$totalAmount' },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            revenue: 1,
          },
        },
      ]);

      return result.map((item: { revenue: number }) => ({
        revenue: item.revenue,
      }));
    }

    const bucketCount = bucketCounts[range];
    let indexExpression: unknown;

    switch (range) {
      case '1D':
        // 6 buckets of 4 hours each
        indexExpression = {
          $floor: {
            $divide: [
              {
                $dateDiff: {
                  startDate: new Date(fromDate!),
                  endDate: '$createdAt',
                  unit: 'hour',
                },
              },
              4,
            ],
          },
        };
        break;

      case '7D':
        // 7 daily buckets
        indexExpression = {
          $dateDiff: {
            startDate: new Date(fromDate!),
            endDate: '$createdAt',
            unit: 'day',
          },
        };
        break;

      case '1M':
        // 30 daily buckets
        indexExpression = {
          $dateDiff: {
            startDate: new Date(fromDate!),
            endDate: '$createdAt',
            unit: 'day',
          },
        };
        break;

      case '1Y':
        // 12 monthly buckets
        indexExpression = {
          $dateDiff: {
            startDate: new Date(fromDate!),
            endDate: '$createdAt',
            unit: 'month',
          },
        };
        break;
    }

    const pipeline = [
      { $match: baseMatch },
      {
        $addFields: {
          bucketIndex: indexExpression,
        },
      },
      {
        $group: {
          _id: '$bucketIndex',
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { index: '$_id', revenue: '$revenue' } },
        },
      },
      {
        $project: {
          _id: 0,
          revenues: {
            $map: {
              input: { $range: [0, bucketCount] },
              as: 'i',
              in: {
                $let: {
                  vars: {
                    found: {
                      $first: {
                        $filter: {
                          input: '$data',
                          cond: { $eq: ['$$this.index', '$$i'] },
                        },
                      },
                    },
                  },
                  in: {
                    revenue: {
                      $ifNull: ['$$found.revenue', 0],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ];

    const result = await this.orderModel.aggregate(pipeline as any);
    const revenues = (result[0] as any)?.revenues as
      | { revenue: number }[]
      | undefined;
    return (
      revenues ||
      (Array(bucketCount).fill({ revenue: 0 }) as { revenue: number }[])
    );
  }
}
