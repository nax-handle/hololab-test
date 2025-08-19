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
                    $cond: [{ $in: ['$status', ['completed']] }, 1, 0],
                  },
                },
                amount: {
                  $sum: {
                    $cond: [
                      { $in: ['$status', ['completed']] },
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
                      { $in: ['$status', ['processing', 'pending']] },
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
  async getOrderChart(fromDate: string, toDate: string) {
    return this.orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(fromDate), $lt: new Date(toDate) },
        },
      },
      {
        $project: {
          amount: 1,
          year: { $year: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } },
          month: {
            $month: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' },
          },
          hour: { $hour: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } },
          dow: {
            $isoDayOfWeek: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' },
          },
        },
      },
      {
        $facet: {
          // ---- 1D: theo khung 4 giờ ----
          '1D': [
            {
              $addFields: {
                slot: { $multiply: [{ $floor: { $divide: ['$hour', 4] } }, 4] },
              },
            },
            { $group: { _id: '$slot', revenue: { $sum: '$totalAmount' } } },
            { $group: { _id: null, data: { $push: '$$ROOT' } } },
            {
              $project: {
                _id: 0,
                '1D': {
                  $map: {
                    input: [0, 4, 8, 12, 16, 20],
                    as: 's',
                    in: {
                      time: { $concat: [{ $toString: '$$s' }, ':00'] },
                      revenue: {
                        $ifNull: [
                          {
                            $first: {
                              $map: {
                                input: {
                                  $filter: {
                                    input: '$data',
                                    as: 'd',
                                    cond: { $eq: ['$$d._id', '$$s'] },
                                  },
                                },
                                as: 'm',
                                in: '$$m.revenue',
                              },
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
          ],

          // ---- 1W: theo thứ ----
          '1W': [
            { $group: { _id: '$dow', revenue: { $sum: '$totalAmount' } } },
            {
              $project: { idx: { $subtract: ['$_id', 1] }, revenue: 1, _id: 0 },
            },
            { $group: { _id: null, data: { $push: '$$ROOT' } } },
            {
              $project: {
                _id: 0,
                '1W': {
                  $map: {
                    input: { $range: [0, 7] },
                    as: 'i',
                    in: {
                      day: {
                        $arrayElemAt: [
                          ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                          '$$i',
                        ],
                      },
                      revenue: {
                        $ifNull: [
                          {
                            $first: {
                              $map: {
                                input: {
                                  $filter: {
                                    input: '$data',
                                    as: 'd',
                                    cond: { $eq: ['$$d.idx', '$$i'] },
                                  },
                                },
                                as: 'm',
                                in: '$$m.revenue',
                              },
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
          ],

          // ---- 1Y: theo tháng ----
          '1Y': [
            { $group: { _id: '$month', revenue: { $sum: '$totalAmount' } } },
            { $group: { _id: null, data: { $push: '$$ROOT' } } },
            {
              $project: {
                _id: 0,
                '1Y': {
                  $map: {
                    input: { $range: [1, 13] },
                    as: 'm',
                    in: {
                      month: {
                        $arrayElemAt: [
                          [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                            'Aug',
                            'Sep',
                            'Oct',
                            'Nov',
                            'Dec',
                          ],
                          { $subtract: ['$$m', 1] },
                        ],
                      },
                      revenue: {
                        $ifNull: [
                          {
                            $first: {
                              $map: {
                                input: {
                                  $filter: {
                                    input: '$data',
                                    as: 'd',
                                    cond: { $eq: ['$$d._id', '$$m'] },
                                  },
                                },
                                as: 'mth',
                                in: '$$mth.revenue',
                              },
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
          ],

          // ---- ALL: theo năm, chỉ năm có dữ liệu ----
          ALL: [
            { $group: { _id: '$year', revenue: { $sum: '$totalAmount' } } },
            { $project: { _id: 0, year: '$_id', revenue: 1 } },
            { $sort: { year: 1 } },
          ],
        },
      },
      {
        $project: {
          '1D': { $first: '$1D.1D' },
          '1W': { $first: '$1W.1W' },
          '1Y': { $first: '$1Y.1Y' },
          ALL: '$ALL',
        },
      },
    ]);
  }
}
