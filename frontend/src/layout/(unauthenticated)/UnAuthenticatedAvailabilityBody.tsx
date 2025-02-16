import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  EventDate,
  EventDay,
  GetSingleEventResponseDataTypeLocal,
} from "@/types/type";
import AvailabilityTable from "@/components/(shared)/AvailabilityTable";
import { useTableDragSelect } from "use-table-drag-select";
import { useState } from "react";
import { buildDefaultDateTimeObject } from "@/utils/availabilityAction";
import { split } from "postcss/lib/list";
import { start } from "repl";

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
  const [sharedAvailabilityState, setSharedAvailabilityState] = useState(() =>
    buildDefaultDateTimeObject(type, eventData!)
  );

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
          <div className="flex space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Copy className="h-4 w-4" />
              <span>Copy link</span>
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800">
              Add availability
            </Button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Calendar Grid */}
          <div className="lg:w-2/3 grid grid-col-8 grid-flow-col-dense">
            {eventData?.type == 1 ? (
              <AvailabilityTable
                ref={ref}
                value={value}
                eventDates={eventData?.event_dates as EventDate[]}
                timeArray={timeArray}
              />
            ) : (
              <AvailabilityTable
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
