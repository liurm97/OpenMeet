import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  EventDate,
  EventDay,
  GetSingleEventResponseDataTypeLocal,
} from "@/types/type";
import WriteAvailabilityTable from "@/components/(shared)/WriteAvailabilityTable";
import { useTableDragSelect } from "use-table-drag-select";
import { useState } from "react";
import { buildDefaultDateTimeObject } from "@/utils/availabilityAction";
import ReadOnlyAvailabilityTable from "@/components/(shared)/ReadOnlyAvailabilityTable";

const UnAuthenticatedAvailabilityBody = ({
  eventData,
}: {
  eventData: GetSingleEventResponseDataTypeLocal | null;
}) => {
  const type = eventData?.type as number;
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

  /* Build time array and to pass to Availability component */
  const timeArray: string[] = [];
  sharedAvailabilityState.availability[0].forEach((_datetime, _ind) => {
    const splitted = _datetime.split(" ");
    const time = splitted[splitted.length - 1];

    if (_ind % 2 == 0) {
      timeArray.push(time);
    }
  });

  console.log(
    `sharedAvailabilityState:: ${JSON.stringify(sharedAvailabilityState)}`
  );
  const [ref, value] = useTableDragSelect(sharedAvailabilityState.shape);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Event Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">{eventData?.name}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Dates placeholder</span>
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
            <Button variant="outline" className="flex items-center">
              <Copy />
              <span>Copy link</span>
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800 flex flex-row">
              {" "}
              <Plus /> <span>Availability</span>
            </Button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Calendar Grid */}
          <div className="lg:w-2/3 grid grid-col-8 grid-flow-col-dense">
            <ReadOnlyAvailabilityTable
              value={valueReadAvailabilityTable}
              eventDates={eventData?.event_dates as EventDate[]}
              eventDays={eventData?.event_days as EventDay[]}
              timeArray={timeArray}
            />
            {eventData?.type == 1 ? (
              <WriteAvailabilityTable
                ref={ref}
                value={value}
                eventDates={eventData?.event_dates as EventDate[]}
                timeArray={timeArray}
              />
            ) : (
              <WriteAvailabilityTable
                ref={ref}
                value={value}
                eventDays={eventData?.event_days as EventDay[]}
                timeArray={timeArray}
              />
            )}
          </div>

          {/* Responses */}
          <div className="lg:w-1/3">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="font-medium text-xl mb-4">
                Responses ({eventData?.event_availabilities!.length})
              </h2>
              <p className="text-gray-600">
                No responses yet. Share the event link to get responses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UnAuthenticatedAvailabilityBody;
