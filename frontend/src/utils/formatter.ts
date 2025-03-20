/*
Global formatter
*/

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { SHORTENED_DAY_OF_WEEK } from "./globals";
import {
  EventDate,
  EventDay,
  GetSingleEventResponseDataTypeLocal,
} from "@/types/type";

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

export const formatDateRange = (
  type: number,
  eventData: GetSingleEventResponseDataTypeLocal | null
): string => {
  /*
  @type: event type
  @eventData: event response data

  Formats the event_dates or event_days array and returns the date/day range string
  */
  let dateRange;
  if (type === 1) {
    const dates = eventData?.event_dates as EventDate[];
    const numDates = dates?.length;

    if (numDates === 1) {
      const firstDate = dates?.[0]?.date as string;
      const formattedFirstDate = dayjs(firstDate).format("MM/DD");
      dateRange = `${formattedFirstDate} - ${formattedFirstDate}`;
    } else {
      const startDate = dates?.[0]?.date as string;
      const endDate = dates?.[dates.length - 1]?.date as string;
      const formattedStartDate = dayjs(startDate).format("MM/DD");
      const formattedEndDate = dayjs(endDate).format("MM/DD");
      dateRange = `${formattedStartDate} - ${formattedEndDate}`;
    }
  } else if (type === 2) {
    const days = eventData?.event_days as EventDay[];

    const formattedDays = days.map((day) => {
      // Long form day i.e Monday
      const dayLongForm = day?.day as string;

      // Short form day i.e Mon
      const dayShortForm = Object.entries(SHORTENED_DAY_OF_WEEK).filter(([k]) =>
        k.includes(dayLongForm)
      )[0][1];

      return dayShortForm;
    });

    // Concatenate days in an array to form a comma separated string of days
    dateRange = formattedDays.join(", ");
  }
  return dateRange as string;
};
