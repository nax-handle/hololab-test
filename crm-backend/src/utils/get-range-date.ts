export interface RangeResult {
  fromDate: Date;
  toDate: Date;
  values: number;
}

function daysInMonthUTC(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  return new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
}

export function getDateRange(range: string): RangeResult {
  const toDate = new Date();
  let fromDate = new Date(toDate);
  let values = 0;

  switch (range) {
    case '1d':
      fromDate.setUTCDate(toDate.getUTCDate() - 1);
      values = 6;
      break;

    case '7d':
      fromDate.setUTCDate(toDate.getUTCDate() - 7);
      values = 7;
      break;

    case '1m':
      fromDate.setUTCMonth(toDate.getUTCMonth() - 1);
      values = daysInMonthUTC(toDate);
      break;

    case '1y':
      fromDate.setUTCFullYear(toDate.getUTCFullYear() - 1);
      values = 12;
      break;

    case 'all':
      fromDate = new Date(Date.UTC(1970, 0, 1));
      values = 5;
      break;

    default:
      fromDate.setUTCDate(toDate.getUTCDate() - 7);
      values = 7;
  }

  return { fromDate, toDate, values };
}
