import moment from "moment-timezone";

export const formatTimeZone = (date: Date) => {
  return moment(date).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm");
};
