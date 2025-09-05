import * as moment from 'moment-timezone';

export interface RangeResult {
  toDate: Date;
  values: number;
  unit: string;
}

export function getDateRange(range: string): RangeResult {
  const timezone = 'Asia/Ho_Chi_Minh';
  const now = moment.tz(timezone);
  let toDate: Date;
  let values = 0;
  let unit = '';

  switch (range) {
    case '1d':
      toDate = now.clone().endOf('hour').toDate();
      values = 7;
      unit = 'hour';
      break;

    case '7d':
      toDate = now.clone().endOf('day').toDate();
      values = 7;
      unit = 'day';
      break;

    case '1m':
      toDate = now.clone().endOf('day').toDate();
      values = 30;
      unit = 'day';
      break;

    case '1y':
      toDate = now.clone().endOf('day').toDate();
      values = 12;
      unit = 'month';
      break;

    case 'all':
      toDate = now.clone().endOf('day').toDate();
      values = 5;
      unit = 'year';
      break;

    default:
      toDate = now.clone().endOf('day').toDate();
      values = 7;
      unit = 'day';
  }

  return { toDate, values, unit };
}
