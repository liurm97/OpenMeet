import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

import {
  DefaultDateTimeObjectType,
  EventDate,
  EventDay,
  GetSingleEventResponseDataTypeLocal,
} from "@/types/type";

/*

"event_availabilities": [
        {
            "respondent_id": "16479418-0484-4c42-a796-35eceeaf87d1",
            "respondent_name": "Max Martin",
            "availabilities": [
                {
                    "time": "2020-01-02 09:00"
                },
            ]
        },
        {
            "respondent_id": "b6c25f2c-6172-4054-a0b9-4f39b3205239",
            "respondent_name": "Max Fury",
            "availabilities": [
                {
                    "time": "2020-01-28 09:00"
                },
            ]
        }
    ]
*/

/*
  const obj = {
    tableShape: [[false, false],[false, false]],
    times: [[0, 0],[0, 0]],
  }

  1. initialize times nested array: times = []

  2. create a nested array of availabilities with time value

  3. retrieve availabilities from eventData

  3.
*/

// interface buildDefaultAvailabilityProp {
//   start_time_local: string; // 09:00:00
//   end_time_local: string; // 17:00:00
//   eventDates?: EventDate[] | [] | undefined;
//   eventDays?: EventDay[] | [] | undefined; // "event_days":[{"day":"Sunday"},{"day":"Thursday"},{"day":"Wednesday"}]
// }

const pushTimeToArray = (
  timeString1: string,
  timeString2: string,
  timeArray: string[],
  interval: number
) =>
  /* Reusable helper function to push time values to array */
  {
    while (timeString1 !== timeString2) {
      // push HH:mm string to array
      timeArray.push(dayjs(timeString1).format("HH:mm"));

      timeString1 = dayjs(timeString1)
        .add(interval, "minute")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  };

export const buildTimeArray = (
  start_time_local: string,
  end_time_local: string,
  interval: number
) =>
  /* Return an array of time at 30min interval

    Condition:
    1. if start_time_local < end_time_local -> return difference in hours between the two
        start_time_local = 09:00:00
        end_time_local = 11:00:00
        return ["09:00:00", "09:30:00", "10:00:00", "10:30:00"];

    2. if start_time_local = end_time_local -> return 24 hours span
        start_time_local = 09:00:00
        end_time_local = 09:00:00
        return ["09:00:00", "09:30:00", "10:00:00", "10:30:00", ....., "08:30:00"];

    3. if start_time_local > end_time_local -> difference in hours between the two
        start_time_local = 11:00:00
        end_time_local = 09:00:00
        eg: 11am - 9am -> ["11:00:00", "11:30:00", "12:00:00", "12:30:00", ....., "08:30:00"];
  */
  {
    // initialize array to store time values
    const startToEndTimeArray: string[] = [];

    const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDay();

    const startTimeLocalDayjsDt = dayjs(
      `${year}-${month}-${day} ${start_time_local}`
    );
    const endTimeLocalDayjsDt = dayjs(
      `${year}-${month}-${day} ${end_time_local}`
    );
    const timeDifference = startTimeLocalDayjsDt.diff(endTimeLocalDayjsDt);

    const startTimeLocalString = startTimeLocalDayjsDt.format(dateTimeFormat);
    const endTimeLocalString = endTimeLocalDayjsDt.format(dateTimeFormat);

    //1. if start_time_local < end_time_local -> return difference in hours between the two
    if (timeDifference < 0) {
      pushTimeToArray(
        startTimeLocalString,
        endTimeLocalString,
        startToEndTimeArray,
        interval
      );
    }
    // 2. if start_time_local = end_time_local -> return 24 hours span
    else if (timeDifference === 0) {
      const startTimeLocalNextDayjsDt = startTimeLocalDayjsDt.add(1, "day");
      const startTimeLocalNextDayjsDtString =
        startTimeLocalNextDayjsDt.format(dateTimeFormat);

      pushTimeToArray(
        startTimeLocalString,
        startTimeLocalNextDayjsDtString,
        startToEndTimeArray,
        interval
      );
    }

    // 3. if start_time_local > end_time_local -> difference in hours between the two
    else {
      const endTimeLocalNextDayjsDt = endTimeLocalDayjsDt.add(1, "day");
      const endTimeLocalNextDayjsDtString =
        endTimeLocalNextDayjsDt.format(dateTimeFormat);

      pushTimeToArray(
        startTimeLocalString,
        endTimeLocalNextDayjsDtString,
        startToEndTimeArray,
        interval
      );
    }

    return startToEndTimeArray;
  };

export const buildDefaultDateTimeObject = (
  type: number,
  prop: GetSingleEventResponseDataTypeLocal
): DefaultDateTimeObjectType =>
  /*
 Generate rows and columns of availability Grid
    - Use start_time, end_time, event_dates/event_days
    - build nested boolean array with time values
    - Example output:
        [
            [2020-01-02 09:00, 2020-01-08 09:00],
            [2020-01-02 09:30, 2020-01-08 09:30],
        ]
*/
  {
    console.log(`buildDefaultDateTimeObject called`);
    let eventDates: EventDate[] | undefined, eventDays: EventDay[] | undefined;

    const dateTimeArray: string[][] = [];
    const startTimeLocal = prop?.start_time_local as string;
    // const startTimeLocal = prop.start_time_local as string;
    const endTimeLocal = prop?.end_time_local as string;
    // const endTimeLocal = prop.end_time_local as string;

    const interval = 30;

    const timeArray = buildTimeArray(startTimeLocal, endTimeLocal, interval);

    // build dateTimeArray `string[][]`
    if (type === 1) {
      eventDates = prop?.event_dates;
      //   eventDates = prop.event_dates;
      eventDates!.map((_date) => {
        const date = _date.date; // date = 2020-01-02

        const row: string[] = [];
        timeArray.map((time) => {
          //time = "09:00:00"

          const d = dayjs(`${date}${time}`).format("YYYY-MM-DD HH:mm");
          console.log(`d:: ${d}`);
          row.push(d);
        });
        dateTimeArray.push(row);
        // compute time difference
      });
    } else if (type === 2) {
      eventDays = prop?.event_days;
      //   eventDays = prop.event_days;
      eventDays!.map((_day) => {
        const day = _day.day; // day = "Monday"

        const row: string[] = [];
        timeArray.map((time) => {
          //time = "09:00:00"

          const d = `${day} ${time}`;
          row.push(d);
        });
        dateTimeArray.push(row);
      });
    }

    // build dateTimeShape array `boolean[][]`
    const dateTimeShape: boolean[][] = dateTimeArray.map((_arr) =>
      _arr.map((_val) => (_val ? false : false))
    );

    return {
      shape: dateTimeShape,
      availability: dateTimeArray,
    };
  };

// const eventData = {
//   id: "f52a51aa-5084-4b50-a5b6-954483c68578",
//   owner: "0344802b-227c-4be4-bf9f-d2deb3a5d82e",
//   name: "seed_db:: valid without owner 1",
//   type: 1,
//   event_respondents: [
//     {
//       id: "16479418-0484-4c42-a796-35eceeaf87d1",
//       name: "Max Martin",
//       isGuestRespondent: true,
//     },
//     {
//       id: "b6c25f2c-6172-4054-a0b9-4f39b3205239",
//       name: "Max Fury",
//       isGuestRespondent: true,
//     },
//   ],
//   start_time_local: "09:00:00",
//   end_time_local: "19:00:00",
//   //   event_dates: [{ date: "2020-01-02" }, { date: "2020-01-28" }],
//   event_days: [{ day: "Monday" }, { day: "Friday" }],
//   event_availabilities: [
//     {
//       respondent_id: "16479418-0484-4c42-a796-35eceeaf87d1",
//       respondent_name: "Max Martin",
//       availabilities: [
//         { time: "2020-01-02 09:00" },
//         { time: "2020-01-02 10:00" },
//         { time: "2020-01-02 11:00" },
//       ],
//     },
//     {
//       respondent_id: "b6c25f2c-6172-4054-a0b9-4f39b3205239",
//       respondent_name: "Max Fury",
//       availabilities: [
//         { time: "2020-01-28 09:00" },
//         { time: "2020-01-28 10:00" },
//         { time: "2020-01-28 11:00" },
//       ],
//     },
//   ],
// };

// const dateTimeArray = buildDefaultDateTimeObject(2, eventData);
// console.log(dateTimeArray);
