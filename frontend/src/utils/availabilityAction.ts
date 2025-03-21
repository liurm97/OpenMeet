import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

import {
  DefaultDateTimeObjectType,
  EventDate,
  EventDay,
  GetSingleEventResponseDataTypeLocalFormatted,
  RespondentAvailabilityType,
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

      // increment timeString by interval duration
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

export const buildDefaultAvailabilityDateTimeObject = (
  type: number,
  // mode: string,
  prop: GetSingleEventResponseDataTypeLocalFormatted
): DefaultDateTimeObjectType =>
  /*
    Generate rows and columns of availability Grid for
    <ReadOnlyAvailabilityTable/> that is the default \
    and <WriteAvailabilityTable/> when adding availability

*/
  {
    console.log("executed");
    let eventDates: EventDate[] | undefined, eventDays: EventDay[] | undefined;

    let readDateTimeShape: boolean[][] = [];
    let writeDateTimeShape: boolean[][] = [];
    const dateTimeArray: string[][] = [];
    const readCommonArray: number[][] = [];
    // const writeCommonArray: number[][] = [];
    const startTimeLocal = prop?.start_time_local as string;
    const endTimeLocal = prop?.end_time_local as string;
    const interval = 30;

    // Construct timeArray based on startTimeLocal and endTimeLocal
    // i.e: timeArray = ["09:00:00", "09:30:00", "10:00:00", "10:30:00"]
    const timeArray = buildTimeArray(startTimeLocal, endTimeLocal, interval);
    const availabilities = prop?.event_availabilities;

    const formattedAvailabilities = availabilities?.map((availability) =>
      availability.availabilities.map((avail) => avail.time_local)
    );
    const formattedAvailabilitiesFlattened = formattedAvailabilities?.flat();

    // Add time_local to eventData to remove formattedAvailabilitiesFlattenedLocal
    // let formattedAvailabilitiesFlattenedLocal: string[] | undefined;
    // build dateTimeArray `string[][]`
    if (type === 1) {
      eventDates = prop?.event_dates;
      eventDates!.map((_date) => {
        const date = _date.date; // i.e: date = "2020-01-02"

        const row: string[] = [];
        timeArray.map((time) => {
          // i.e: time = "09:00:00"

          const d = dayjs(`${date}${time}`).format("YYYY-MM-DD HH:mm");
          row.push(d);
        });
        dateTimeArray.push(row);
      });
    } else if (type === 2) {
      eventDays = prop?.event_days;
      eventDays!.map((_day) => {
        const day = _day.day; // i.e: day = "Monday"

        const row: string[] = [];
        timeArray.map((time) => {
          //i.e: time = "09:00:00"

          const d = `${day} ${time}`;
          row.push(d);
        });
        dateTimeArray.push(row);
      });
    }

    // if (mode == "write") {
    // To build an empty commonArray and dateTimeShape array with all false
    // To render blank availability grid for add Availability action
    // i.e: commonArray = [0,0,0,0]
    // i.e: dateTimeShape = [false, false, false ,false]
    // dateTimeArray.forEach(() =>
    //   writeCommonArray.push(new Array(dateTimeArray[0].length).fill(0))
    // );
    // } else if (mode == "read") {
    // To build commonArray and dateTimeShape array based on respondents' common availabilities
    dateTimeArray.forEach((dtArr) => {
      const row = new Array(dtArr.length).fill(0);
      dtArr.forEach((dt, dt_ind) => {
        formattedAvailabilitiesFlattened?.forEach((avail_local) => {
          if (dt === avail_local) {
            row[dt_ind] += 1;
          }
        });
      });
      readCommonArray.push(row);
    });
    // }
    // build dateTimeShape based on common availabilities
    writeDateTimeShape = dateTimeArray.map((_arr) => _arr.map(() => false));

    // build dateTimeShape based on common availabilities
    readDateTimeShape = readCommonArray.map((_arr) =>
      _arr.map((_val) => (_val == 0 ? false : true))
    );

    /*
    Construct respondent availability array
    i.e:
      [{
        id: '9776ed61-ac5a-48c1-9c77-5706b47d35fc',
        availability: [ 'Monday 17:00', 'Monday 18:00', 'Monday 18:30' ]
      }]
    */
    const respondentAvailabilities = availabilities?.map((availabilities) => {
      const respondentId = availabilities.respondent_id;
      const respondentName = availabilities.respondent_name;
      const respondentAvailbility = availabilities.availabilities;
      const availability = respondentAvailbility.map(
        (avail) => avail.time_local
      );
      return {
        respondentId: respondentId,
        respondentName: respondentName,
        respondentAvailability: availability,
      };
    });

    const respondentAvailabilityArray = respondentAvailabilities?.map(
      (respondent) => {
        const booleanAvailability = dateTimeArray.map((avail) =>
          new Array(avail.length).fill(false)
        );

        const respondentId = respondent.respondentId;
        const respondentName = respondent.respondentName;
        const respondentAvailabilities = respondent.respondentAvailability;

        // console.log(respondentAvailabilities);

        for (let i = 0; i < dateTimeArray.length; ++i) {
          for (let j = 0; j < dateTimeArray[i].length; ++j) {
            const time = dateTimeArray[i][j];
            if (respondentAvailabilities.includes(time)) {
              booleanAvailability[i][j] = true;
            }
          }
        }
        return {
          id: respondentId,
          name: respondentName,
          availability: booleanAvailability,
        };
      }
    ) as RespondentAvailabilityType[];

    return {
      readShape: readDateTimeShape,
      writeShape: writeDateTimeShape,
      common: readCommonArray,
      availability: dateTimeArray,
      respondentAvailability: respondentAvailabilityArray,
    };
  };
