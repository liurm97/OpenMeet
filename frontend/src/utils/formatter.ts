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
  EventTimeUTC,
  GetSingleEventResponseDataTypeLocalFormatted,
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
  eventData: GetSingleEventResponseDataTypeLocalFormatted | null
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

export const formatDayTimeStringUTC = (dayTimeString: string) => {
  /*
  @dayTimeString: input daytime string i.e: Monday 09:00

  Format day time string from UTC to local time
  i.e Format Monday 09:00 UTC -> Monday 17:00 UTC+08:00
  */

  const splitted = dayTimeString.split(" ");
  const day = splitted[0];
  const inputTime = splitted[splitted.length - 1];

  const now = new Date();
  const date = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();
  const offSet = now.getTimezoneOffset();
  const newDT = `${year}-${month}-${date}T${inputTime}:00`;
  let output: string | undefined;
  // local timezone is ahead of UTC - Add to utc time
  if (offSet < 0) {
    output = `${day} ${dayjs(newDT)
      .add(Math.abs(offSet), "minute")
      .format("HH:mm")}`;
  } else {
    // local timezone is before UTC - Subtract from utc time
    output = `${day} ${dayjs(newDT)
      .subtract(Math.abs(offSet), "minute")
      .format("HH:mm")}`;
  }

  return output;
};

export const formatDayTimeStringLocal = (dayTimeStringLocal: string) => {
  /*
  @dayTimeStringLocal: input local daytime string i.e: Monday 09:00

  Format day time string from local time to UTC
  i.e Format Monday 09:00 UTC+08:00 -> Monday 01:00 UTC
  */

  const splitted = dayTimeStringLocal.split(" ");
  const day = splitted[0];
  const inputTime = splitted[splitted.length - 1];

  const now = new Date();
  const date = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();
  const offSet = now.getTimezoneOffset();
  const newDT = `${year}-${month}-${date}T${inputTime}:00`;
  let output: string | undefined;
  // local timezone is ahead of UTC - Add to utc time
  if (offSet > 0) {
    output = `${day} ${dayjs(newDT)
      .add(Math.abs(offSet), "minute")
      .format("HH:mm")}`;
  } else {
    // local timezone is before UTC - Subtract from utc time
    output = `${day} ${dayjs(newDT)
      .subtract(Math.abs(offSet), "minute")
      .format("HH:mm")}`;
  }

  return output;
};

export const formatAvailabilityBooleanToString = (
  type: number,
  inputArray: boolean[][],
  localDateTimeArray: string[][]
): EventTimeUTC[] => {
  /*
  @inputArray: boolean input array to format
  @localDateTimeArray: datetime array in local timezone to be used to map

  Formats boolean input array to string[][] and return UTC datetime/daytime string array
  */
  const outputArrayLocal: string[] = [];
  const outputArrayUTC: EventTimeUTC[] = [];

  for (let i = 0; i < inputArray.length; ++i) {
    for (let j = 0; j < inputArray[i].length; ++j) {
      if (inputArray[i][j]) outputArrayLocal.push(localDateTimeArray[i][j]);
    }
  }

  if (type == 1) {
    outputArrayLocal.forEach((localDateTime) => {
      const format = `YYYY-MM-DD HH:mm`;
      const raw_d = new Date(localDateTime).toISOString();
      outputArrayUTC.push({
        time_utc: dayjs(new Date(raw_d)).utc().format(format),
      });
    });
  } else {
    outputArrayLocal.forEach((localDayTime) =>
      outputArrayUTC.push({ time_utc: formatDayTimeStringLocal(localDayTime) })
    );
  }
  return outputArrayUTC;
};

export const formatTimeArray = (availability: string[][]): string[] => {
  return availability[0].map((_datetime, _ind) => {
    // Split datetime and get the time value. i.e -> 10:00, 11:00, 12:00
    const splitted = _datetime.split(" ");
    const time = splitted[splitted.length - 1];

    // Push time ending with `00` to timeArray. i.e -> 10:00, 11:00, 12:00
    if (_ind % 2 == 0) {
      return time;
    }
  }) as string[];
};
