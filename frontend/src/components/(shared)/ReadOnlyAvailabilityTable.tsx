import { EventDate, EventDay } from "@/types/type";
import { COMMON_AVAILABILITY_COLOR } from "@/utils/globals";
import { forwardRef } from "react";

interface Props {
  value: boolean[][];
  eventDates?: EventDate[] | undefined;
  eventDays?: EventDay[] | undefined;
  timeArray: string[];
  commonArray: number[][];
}
const ReadOnlyAvailabilityTable = forwardRef<HTMLTableElement, Props>(
  ({ value, eventDates, eventDays, timeArray, commonArray }) => {
    return (
      <>
        <div className="flex flex-col justify-self-end">
          <div className="size-14" />
          {timeArray.map((time, _ind) => (
            <div key={`time${_ind}`}>
              <div className="size-6">{time}</div>
              <div className="size-6"></div>
            </div>
          ))}
        </div>
        <table className="flex flex-col col-span-7">
          <thead className="flex-grow">
            <tr className="flex">
              {eventDays == undefined
                ? eventDates!.map((_date, _ind) => (
                    <th key={`eventDate${_ind}`} className="size-14 grow">
                      {_date.date as string}
                    </th>
                  ))
                : eventDays!.map((_day, _ind) => (
                    <th key={`eventDay${_ind}`} className="size-14 grow">
                      {_day.day as string}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody className="flex">
            {value.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`flex flex-col grow`}
                onClick={() => {
                  console.log("clicked");
                }}
              >
                {row.map((_, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={`border-x border-y border-gray-200 border-dashed size-6 w-full
                    ${
                      value[rowIndex][columnIndex]
                        ? COMMON_AVAILABILITY_COLOR.filter(
                            (obj) =>
                              obj.number == commonArray[rowIndex][columnIndex]
                          )[0].color
                        : "bg-transparent"
                    }`}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
);

export default ReadOnlyAvailabilityTable;
