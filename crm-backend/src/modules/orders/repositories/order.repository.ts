import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';

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
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
                amount: { $sum: '$totalAmount' },
              },
            },
            { $project: { _id: 0, status: '$_id', count: 1, amount: 1 } },
            { $sort: { status: 1 } },
          ],
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
          // >>> gộp processing + pending
          inProgress: [
            {
              $group: {
                _id: null,
                count: {
                  $sum: {
                    $cond: [
                      { $in: ['$status', ['processing', 'pending']] },
                      1,
                      0,
                    ],
                  },
                },
                amount: {
                  $sum: {
                    $cond: [
                      { $in: ['$status', ['processing', 'pending']] },
                      '$totalAmount',
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
          byStatus: 1,
          totalOrders: {
            $ifNull: [{ $arrayElemAt: ['$totals.totalOrders', 0] }, 0],
          },
          totalAmount: {
            $ifNull: [{ $arrayElemAt: ['$totals.totalAmount', 0] }, 0],
          },
          inProgressCount: {
            $ifNull: [{ $arrayElemAt: ['$inProgress.count', 0] }, 0],
          },
          inProgressAmount: {
            $ifNull: [{ $arrayElemAt: ['$inProgress.amount', 0] }, 0],
          },
        },
      },
    ]);
  }
}
