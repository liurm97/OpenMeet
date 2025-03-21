import { EventDate, EventDay } from "@/types/type";
import { COMMON_AVAILABILITY_COLOR } from "@/utils/globals";
import { forwardRef } from "react";
import { toast } from "sonner";

interface Props {
  value: boolean[][];
  eventDates?: EventDate[] | undefined;
  eventDays?: EventDay[] | undefined;
  timeArray: string[];
  commonArray: number[][];
  isHovering: boolean;
}

// `ref` is intentionally removed to disable drag and drop effect
const ReadOnlyAvailabilityTable = forwardRef<HTMLTableElement, Props>(
  (
    { value, eventDates, eventDays, timeArray, commonArray, isHovering },
    ref
  ) => {
    return (
      <>
        <div className="flex flex-col justify-self-end col-start-0">
          <div className="size-14" />
          {timeArray.map((time, _ind) => (
            <div key={`time${_ind}`}>
              <div className="size-6">{time}</div>
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
                  toast(
                    <p>
                      Hello! Click on the{" "}
                      <span className="font-bold">+ Availability</span> button
                      at the top right to add availability!
                    </p>
                  );
                }}
              >
                {row.map((_, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={`border-x border-y border-gray-200 border-dashed size-6 w-full border-collapse
                    ${
                      isHovering && value[rowIndex][columnIndex]
                        ? "bg-gray-200 border-gray-400"
                        : !isHovering && value[rowIndex][columnIndex]
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
