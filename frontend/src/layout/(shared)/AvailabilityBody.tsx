import { CheckCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  EventDate,
  EventDay,
  GetSingleEventResponseDataTypeLocal,
} from "@/types/type";
import { useTableDragSelect } from "use-table-drag-select";
import { useState } from "react";
import { buildDefaultDateTimeObject } from "@/utils/availabilityAction";
import { toast } from "sonner";
import AvailabilityGrid from "./AvailabilityGrid";
import dayjs from "dayjs";
import { SHORTENED_DAY_OF_WEEK } from "@/utils/globals";

const UnAuthenticatedAvailabilityBody = ({
  eventData,
}: {
  eventData: GetSingleEventResponseDataTypeLocal | null;
}) => {
  const type = eventData?.type as number;

  let dateRange: string | undefined = undefined;

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
    console.log(`days:: ${JSON.stringify(days)}`);

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
  // const handleEditAvailability = async (respondentId: string) => {
  //   return new Promise(() => resolve("hi"));
  // };

  // const defaultDateTimeObject = buildDefaultDateTimeObject(type, eventData);
  // const defaultDateTimeShape = defaultDateTimeObject.shape;

  // console.log(`defaultDateTimeShape:: ${JSON.stringify(defaultDateTimeShape)}`);
  // const availabilityObj = {
  //   shape: [],
  //   availability: [],
  // };
  /*
  const obj = {
    tableShape: [[false, false],[false, false]],
    times: [[0, 0],[0, 0]],
  }
  */

  /*  create object consisting of array and ref to render <WriteAvailabilityTable/> */
  const [sharedAvailabilityState, setSharedAvailabilityState] = useState(() =>
    buildDefaultDateTimeObject(type, eventData!)
  );

  /*  Output boolean[][] array to render <ReadAvailabilityTable/> */
  const valueReadAvailabilityTable = buildDefaultDateTimeObject(
    type,
    eventData!
  ).shape;

  /* Build time array and to pass to Availability component to render start time local and end time local */
  const timeArray: string[] = [];

  // Take the first row of the availability datetime array
  sharedAvailabilityState.availability[0].forEach((_datetime, _ind) => {
    // Split datetime and get the time value. i.e -> 10:00, 11:00, 12:00
    const splitted = _datetime.split(" ");
    const time = splitted[splitted.length - 1];

    // Push time ending with `00` to timeArray. i.e -> 10:00, 11:00, 12:00
    if (_ind % 2 == 0) {
      timeArray.push(time);
    }
  });

  console.log(
    `sharedAvailabilityState:: ${JSON.stringify(sharedAvailabilityState)}`
  );
  const [useTableRef, useTableValue] = useTableDragSelect(
    sharedAvailabilityState.shape
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Event Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">{eventData?.name}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{dateRange as string}</span>
              <Button variant="outline" size="sm">
                Edit event
              </Button>
            </div>
            <button className="mt-2 text-black hover:underline flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Agenda</span>
            </button>
          </div>
          <div className="flex items-center gap-2 justify-center [@media(max-width:770px)]:flex-col">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast(
                  <div className="flex flex-row gap-2">
                    <CheckCheck size={48} className="text-green-600" />
                    <p>
                      Copied{" "}
                      <span className="font-bold">{window.location.href}</span>
                    </p>
                  </div>
                );
              }}
            >
              <Copy />
              <span>Copy link</span>
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800 flex flex-row">
              {" "}
              <Plus /> <span>Availability</span>
            </Button>
          </div>
        </div>

        {/* Grid - Availability table + Response section */}
        <AvailabilityGrid
          useTableRef={useTableRef}
          useTableValue={useTableValue}
          valueReadAvailabilityTable={valueReadAvailabilityTable}
          eventData={eventData as GetSingleEventResponseDataTypeLocal}
          timeArray={timeArray}
        />
      </div>
    </main>
  );
};

export default UnAuthenticatedAvailabilityBody;
