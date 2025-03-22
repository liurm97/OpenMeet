import { EventDate, EventDay } from "@/types/type";
import { ADDUSERAVAILABILITY, EDITUSERAVAILABILITY } from "@/utils/constants";
import { forwardRef } from "react";
import { useTableDragSelect } from "use-table-drag-select";

interface Props {
  eventId: string;
  eventDates?: EventDate[] | undefined;
  eventDays?: EventDay[] | undefined;
  timeArray: string[];
  writeShape: boolean[][];
  writeModeTypeRef: React.MutableRefObject<string | undefined>;
}

const WriteAvailabilityTable = forwardRef<HTMLTableElement, Props>(
  (
    { eventId, eventDates, eventDays, timeArray, writeShape, writeModeTypeRef },
    ref
  ) => {
    const [useTableRef, useTableValue] = useTableDragSelect(writeShape);
    const editRespondentIdAvailability: undefined | boolean[][] = useTableValue;

    if (writeModeTypeRef.current == "edit") {
      localStorage.setItem(
        `${EDITUSERAVAILABILITY}${eventId}`,
        JSON.stringify(editRespondentIdAvailability)
      );
    } else if (writeModeTypeRef.current == "add") {
      localStorage.setItem(
        `${ADDUSERAVAILABILITY}${eventId}`,
        JSON.stringify(editRespondentIdAvailability)
      );
    }

    return (
      <>
        <div className="flex flex-col justify-self-end">
          <div className="size-14" />
          {timeArray.map((time, _ind) => (
            <div key={`time${_ind}`}>
              <div className="size-6">{time}</div>
            </div>
          ))}
        </div>
        <table ref={useTableRef} className="flex flex-col col-span-7">
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
            {useTableValue.map((row, rowIndex) => (
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
                      useTableValue[rowIndex][columnIndex]
                        ? "bg-gray-300"
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

export default WriteAvailabilityTable;
