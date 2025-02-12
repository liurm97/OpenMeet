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
): string =>
  /* Converts date from local timezone to UTC */
  {
    const inputDateStartTimeUTC = dayjs(
      `${dayjs(new Date(inputDate).toISOString()).format(
        dateFormat
      )} ${inputStartTime}`
    ).format(datetimeFormat);

    const outputDateUTC = dayjs(inputDateStartTimeUTC).utc().format(dateFormat);

    return outputDateUTC;
  };

export const formatCalendarTime = (inputTime: string): string =>
  /* Converts time from local timezone to UTC */
  {
    return dayjs(
      `${dayjs(new Date().toISOString()).format(dateFormat)} ${inputTime}`
    )
      .utc()
      .format(timeFormat);
  };
