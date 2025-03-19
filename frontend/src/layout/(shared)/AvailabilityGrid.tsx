import ReadOnlyAvailabilityTable from "@/components/(shared)/ReadOnlyAvailabilityTable";
import WriteAvailabilityTable from "@/components/(shared)/WriteAvailabilityTable";
import {
  EventDate,
  EventDay,
  GetSingleEventResponseDataTypeLocal,
} from "@/types/type";
import { Pencil, PenOff, Smile } from "lucide-react";

const AvailabilityGrid = ({
  useTableRef,
  useTableValue,
  valueReadAvailabilityTable,
  eventData,
  timeArray,
}: {
  useTableRef: React.RefObject<HTMLTableElement>;
  useTableValue: boolean[][];
  valueReadAvailabilityTable: boolean[][];
  eventData: GetSingleEventResponseDataTypeLocal;
  timeArray: string[];
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-2 border border-black p-4">
      {/* Calendar Grid */}
      <div className="lg:w-2/3 grid grid-col-8 grid-flow-col-dense items-start">
        <ReadOnlyAvailabilityTable
          value={valueReadAvailabilityTable}
          eventDates={eventData?.event_dates as EventDate[]}
          eventDays={eventData?.event_days as EventDay[]}
          timeArray={timeArray}
        />
        {eventData?.type == 1 ? (
          <WriteAvailabilityTable
            ref={useTableRef}
            value={useTableValue}
            eventDates={eventData?.event_dates as EventDate[]}
            timeArray={timeArray}
          />
        ) : (
          <WriteAvailabilityTable
            ref={useTableRef}
            value={useTableValue}
            eventDays={eventData?.event_days as EventDay[]}
            timeArray={timeArray}
          />
        )}
      </div>

      {/* Responses */}
      <div className="lg:w-1/3">
        <div className="p-6 rounded-lg flex flex-col">
          <h2 className="font-medium text-xl mb-4">
            Responses ({eventData?.event_availabilities!.length})
          </h2>
          {eventData?.event_availabilities!.length === 0 && (
            <p className="text-gray-600 mb-4">
              No responses yet. Share the event link to get responses.
            </p>
          )}
          <div className="flex flex-col gap-4 justify-center">
            {eventData?.event_respondents?.map((respondent, _ind: number) =>
              respondent.isGuestRespondent ? (
                <div
                  key={`event_respondents${_ind}`}
                  className="flex flex-row justify-between group"
                >
                  <div className="flex flex-row gap-1 items-center">
                    <Smile size={16} />
                    <p className="text-sm">{respondent.name}</p>
                  </div>
                  <button
                    className="hidden group-hover:block"
                    // onClick={() => }
                  >
                    <Pencil size={16} className="text-gray-500" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-row justify-between group hover:text-gray-500">
                  <div className="flex flex-row gap-1 items-center">
                    <Smile size={16} />
                    <p className="text-sm">{respondent.name}</p>
                  </div>
                  <button className="hidden cursor-not-allowed group-hover:block">
                    <PenOff size={16} className="text-gray-500" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityGrid;
