/*
Format date, time, etc
*/

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const timeFormat = `HH:mm:ss`;
const dateFormat = `YYYY-MM-DD`;
const datetimeFormat = `${dateFormat} ${timeFormat}`;

export const formatCalendarDate = (
  inputDate: Date,
  inputStartTime: string
): string => {
  /*
        input format = YYYY-MM-DDTHH:mm:ss.SSSZ (local timezonea);
        ouput format = HH:mm:ss
    */

  const inputDateStartTimeUTC = dayjs(
    `${dayjs(new Date(inputDate).toISOString()).format(
      dateFormat
    )} ${inputStartTime}`
  ).format(datetimeFormat);

  const outputDateUTC = dayjs(inputDateStartTimeUTC).utc().format(dateFormat);

  return outputDateUTC;
};
// Mon Dec 02 2024 00:00:00 GMT+0800 (Singapore Standard Time)

export const formatCalendarTime = (inputTime: string): string => {
  return dayjs(
    `${dayjs(new Date().toISOString()).format(dateFormat)} ${inputTime}`
  )
    .utc()
    .format(timeFormat);
};
