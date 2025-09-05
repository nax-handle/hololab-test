import * as moment from 'moment-timezone';

export interface RangeResult {
  fromDate: Date;
  toDate: Date;
  values: number;
  unit: string;
}

export function getDateRange(range: string): RangeResult {
  const timezone = 'Asia/Ho_Chi_Minh';
  const now = moment.tz(timezone);
  let toDate: Date;
  let fromDate: Date;
  let values = 0;
  let unit = '';

  switch (range) {
    case '1d':
      // Use current hour as the upper bound for hourly buckets
      toDate = now.clone().endOf('hour').toDate();
      values = 24; // last 24 hours
      unit = 'hour';
      fromDate = now
        .clone()
        .subtract(values - 1, 'hour')
        .startOf('hour')
        .toDate();
      break;

    case '7d':
      toDate = now.clone().endOf('day').toDate();
      fromDate = now.clone().subtract(6, 'days').startOf('day').toDate();
      values = 7;
      unit = 'day';
      break;

    case '1m':
      toDate = now.clone().endOf('day').toDate();
      fromDate = now.clone().subtract(1, 'month').startOf('day').toDate();
      values = 30;
      unit = 'day';
      break;

    case '1y':
      toDate = now.clone().endOf('day').toDate();
      fromDate = now.clone().subtract(1, 'year').startOf('day').toDate();
      values = 12;
      unit = 'month';
      break;

    case 'all':
      toDate = now.clone().endOf('day').toDate();
      fromDate = moment.tz('1970-01-01', timezone).startOf('day').toDate();
      values = 5;
      unit = 'year';
      break;

    default:
      toDate = now.clone().endOf('day').toDate();
      fromDate = now.clone().subtract(7, 'days').startOf('day').toDate();
      values = 7;
      unit = 'day';
  }

  return { fromDate, toDate, values, unit };
}
