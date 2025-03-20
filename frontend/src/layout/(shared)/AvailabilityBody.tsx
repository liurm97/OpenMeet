import { CheckCheck, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { GetSingleEventResponseDataTypeLocal } from "@/types/type";
import { useTableDragSelect } from "use-table-drag-select";
import { useState } from "react";
import { buildDefaultDateTimeObject } from "@/utils/availabilityAction";
import { toast } from "sonner";
import AvailabilityGrid from "./AvailabilityGrid";
import { formatDateRange } from "@/utils/formatter";
import AgendaDialog from "@/components/(shared)/AgendaDialog";
import EditEventNameDialog from "@/components/(shared)/EditEventNameDialog";

const UnAuthenticatedAvailabilityBody = ({
  eventData,
}: {
  eventData: GetSingleEventResponseDataTypeLocal | null;
}) => {
  // Variables
  const type = eventData?.type as number;
  const eventId = eventData?.id as string;
  const eventAgenda = eventData?.agenda as string;
  const eventName = eventData?.name as string;
  const dateRange = formatDateRange(type, eventData);

  // useStates
  const [agenda, setAgenda] = useState<string>(eventAgenda);
  const [, setName] = useState<string>(eventName);

  /*  create object consisting of array and ref to render <WriteAvailabilityTable/> */
  const [writeAvailabilityState, setWriteAvailabilityState] = useState(() =>
    buildDefaultDateTimeObject(type, eventData!)
  );

  /*  Output boolean[][] array to render <ReadAvailabilityTable/> */
  const valueReadAvailabilityTable = buildDefaultDateTimeObject(
    type,
    eventData as GetSingleEventResponseDataTypeLocal
  ).shape;

  /* Build time array and to pass to Availability component to render start time local and end time local */
  const timeArray: string[] = [];

  // Take the first row of the availability datetime array
  writeAvailabilityState.availability[0].forEach((_datetime, _ind) => {
    // Split datetime and get the time value. i.e -> 10:00, 11:00, 12:00
    const splitted = _datetime.split(" ");
    const time = splitted[splitted.length - 1];

    // Push time ending with `00` to timeArray. i.e -> 10:00, 11:00, 12:00
    if (_ind % 2 == 0) {
      timeArray.push(time);
    }
  });

  console.log(
    `writeAvailabilityState:: ${JSON.stringify(writeAvailabilityState)}`
  );
  const [useTableRef, useTableValue] = useTableDragSelect(
    writeAvailabilityState.shape
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Event name + Date range + Agenda section*/}
        <div className="flex justify-between items-start mb-8">
          <div>
            {/* Event name */}
            <div className="flex flex-row items-center gap-1">
              <h1 className="text-2xl font-bold mb-1">{eventData?.name} </h1>
              <EditEventNameDialog
                eventName={eventName}
                eventId={eventId}
                setName={setName}
              />
            </div>

            {/* Date range */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{dateRange as string}</span>
            </div>

            {/* Agenda */}
            <div className="flex flex-col justify-center py-1">
              <p className="italic">
                <span className="font-bold">Agenda: </span>
                {agenda === "" ? "n/a" : agenda}
              </p>
              <AgendaDialog
                eventAgenda={eventAgenda}
                eventId={eventId}
                setAgenda={setAgenda}
              />
            </div>
          </div>

          {/* Copy link + Add Availability section */}
          <div className="flex items-center gap-2 justify-center [@media(max-width:770px)]:flex-col">
            {/* Copy link */}
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

            {/* Add Availability*/}
            <Button className="bg-black text-white hover:bg-gray-800 flex flex-row">
              {" "}
              <Plus /> <span>Availability</span>
            </Button>
          </div>
        </div>

        {/* Availability Grid + Response section */}
        <AvailabilityGrid
          useTableRef={useTableRef}
          useTableValue={useTableValue}
          valueReadAvailabilityTable={valueReadAvailabilityTable}
          eventData={eventData as GetSingleEventResponseDataTypeLocal}
          timeArray={timeArray}
          commonArray={writeAvailabilityState.common}
        />
      </div>
    </main>
  );
};

export default UnAuthenticatedAvailabilityBody;
