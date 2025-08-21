export interface RangeResult {
  fromDate: Date;
  toDate: Date;
  values: number;
}
const ONE_DAY = 24 * 60 * 60 * 1000;
export function getDateRange(range: string): RangeResult {
  const toDate = new Date(new Date().setHours(23, 59, 59, 999) + ONE_DAY);
  let fromDate: Date = new Date(toDate.setHours(0, 0, 0, 0) + ONE_DAY);
  let values = 0;

  switch (range) {
    case '1d':
      fromDate.setUTCDate(toDate.getUTCDate() - 1);
      values = 6;
      break;

    case '7d':
      fromDate.setUTCDate(toDate.getUTCDate() - 6);
      values = 7;
      break;

    case '1m':
      fromDate.setUTCMonth(toDate.getUTCMonth() - 1);
      values = 30;
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
