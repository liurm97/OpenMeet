/*
Format date, time, etc
*/

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeFormat = `HH:mm:ss`;
const dateFormat = `YYYY-MM-DD`;
const datetimeFormat = `${dateFormat} ${timeFormat}`;

export const formatCalendarDateUTC = (
  localInputDate: Date,
  localInputStartTime: string
): string =>
  /* Converts date from local timezone to UTC */
  {
    const inputDateStartTimeUTC = dayjs(
      `${dayjs(new Date(localInputDate).toISOString()).format(
        dateFormat
      )} ${localInputStartTime}`
    ).format(datetimeFormat);

    const outputDateUTC = dayjs(inputDateStartTimeUTC).utc().format(dateFormat);

    return outputDateUTC;
  };

export const formatCalendarDateLocal = (
  utcDate: Date,
  utcStartTime: string
): string =>
  /* Converts date from UTC to local date */
  {
    const base = dayjs(new Date(utcDate).toISOString()).format(dateFormat);
    const localTime = new Date(`${base} ${utcStartTime} UTC`).toString();
    return dayjs(localTime).format(dateFormat);
  };

export const formatCalendarTimeUTC = (inputTimeLocal: string): string =>
  /* Converts time from local timezone to UTC */
  {
    return dayjs(
      `${dayjs(new Date().toISOString()).format(dateFormat)} ${inputTimeLocal}`
    )
      .utc()
      .format(timeFormat);
  };

export const formatCalendarTimeLocal = (inputTimeUTC: string): string =>
  /* Converts time from local timezone to UTC */
  {
    const base = dayjs(new Date().toISOString()).format(dateFormat);
    const localTime = new Date(`${base} ${inputTimeUTC} UTC`).toString();
    return dayjs(localTime).format(timeFormat);
  };
