export interface RangeResult {
  fromDate: Date;
  toDate: Date;
  values: number;
}

export function getDateRange(range: string): RangeResult {
  const now = new Date();
  let fromDate = new Date();
  let values = 0;
  switch (range) {
    case '1d':
      fromDate.setDate(now.getDate() - 1);
      values = 6;
      break;

    case '7d':
      fromDate.setDate(now.getDate() - 7);
      values = 7;
      break;

    case '1m':
      fromDate.setMonth(now.getMonth() - 1);
      values = 30;
      break;

    case '1y':
      fromDate.setFullYear(now.getFullYear() - 1);
      values = 12;
      break;

    case 'all':
      fromDate = new Date(1970, 0, 1);
      values = 5;
      break;
  }
  return { fromDate, toDate: now, values };
}
