import * as moment from 'moment-timezone';

export interface RangeResult {
  fromDate: Date;
  toDate: Date;
  values: number;
}

export function getDateRange(range: string): RangeResult {
  const timezone = 'Asia/Ho_Chi_Minh';
  const now = moment.tz(timezone);
  const toDate = now.clone().endOf('day').toDate();
  let fromDate: Date;
  let values = 0;

  switch (range) {
    case '1d':
      fromDate = now.clone().subtract(1, 'day').startOf('day').toDate();
      values = 6;
      break;

    case '7d':
      fromDate = now.clone().subtract(6, 'days').startOf('day').toDate();
      values = 7;
      break;

    case '1m':
      fromDate = now.clone().subtract(1, 'month').startOf('day').toDate();
      values = 30;
      break;

    case '1y':
      fromDate = now.clone().subtract(1, 'year').startOf('day').toDate();
      values = 12;
      break;

    case 'all':
      fromDate = moment.tz('1970-01-01', timezone).startOf('day').toDate();
      values = 5;
      break;

    default:
      fromDate = now.clone().subtract(7, 'days').startOf('day').toDate();
      values = 7;
  }

  return { fromDate, toDate, values };
}
