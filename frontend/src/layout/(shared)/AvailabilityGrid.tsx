import ReadOnlyAvailabilityTable from "@/components/(shared)/ReadOnlyAvailabilityTable";
import WriteAvailabilityTable from "@/components/(shared)/WriteAvailabilityTable";
import {
  DefaultDateTimeObjectType,
  EventDate,
  EventDay,
  GetSingleEventResponseDataTypeLocalFormatted,
  RespondentAvailabilityType,
} from "@/types/type";
import { EDITUSER } from "@/utils/constants";
import { Pencil, PenOff, Smile } from "lucide-react";
import { useState } from "react";

const AvailabilityGrid = ({
  availabilityState,
  eventData,
  timeArray,
  mode,
  setMode,
  writeModeTypeRef,
  previousArrayRef,
  editRespondentNameRef,
}: {
  availabilityState: DefaultDateTimeObjectType;
  eventData: GetSingleEventResponseDataTypeLocalFormatted;
  timeArray: string[];
  mode: string;
  setMode: React.Dispatch<string>;
  writeModeTypeRef: React.MutableRefObject<string | undefined>;
  previousArrayRef: React.MutableRefObject<boolean[][]>;
  editRespondentNameRef: React.MutableRefObject<string | undefined>;
}) => {
  console.log(previousArrayRef.current);
  // variables
  const respondentAvailability = availabilityState.respondentAvailability;
  const readCommonArray = availabilityState.common;

  console.log(respondentAvailability);
  console.log(readCommonArray);

  // useStates
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // useRefs
  // const previousArray = useRef(availabilityState.readShape);

  const getSpecificRespondentAvailability = (
    respondentId: string,
    respondentAvailabilityArray: RespondentAvailabilityType[]
  ): boolean[][] => {
    /*
      @respondentId: id of a respondent

      Get and return respondent availability from readAvailabilityState object by respondent id
    */
    return respondentAvailabilityArray.filter(
      (r_avail) => r_avail.id === respondentId
    )[0].availability;
  };

  const getSpecificRespondentName = (
    respondentId: string,
    respondentAvailabilityArray: RespondentAvailabilityType[]
  ): string => {
    /*
      @respondentId: id of a respondent

      Get and return respondent availability from readAvailabilityState object by respondent id
    */
    return respondentAvailabilityArray.filter(
      (r_avail) => r_avail.id === respondentId
    )[0].name;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2 border rounded-xl border-gray-400 p-4">
      {/* Calendar Grid */}
      <div className="lg:w-2/3 grid grid-col-8 grid-flow-col-dense items-start">
        {/* Read only table */}
        {mode == "read" && (
          <ReadOnlyAvailabilityTable
            // value={valueReadAvailabilityTable}
            isHovering={isHovering}
            value={previousArrayRef.current}
            eventDates={eventData?.event_dates as EventDate[]}
            eventDays={eventData?.event_days as EventDay[]}
            timeArray={timeArray}
            commonArray={readCommonArray}
          />
        )}

        {/* Write table */}
        {mode == "write" &&
          writeModeTypeRef.current == "add" &&
          (eventData?.type == 1 ? (
            <WriteAvailabilityTable
              eventId={eventData?.id as string}
              writeShape={availabilityState.writeShape}
              eventDates={eventData?.event_dates as EventDate[]}
              timeArray={timeArray}
              writeModeTypeRef={writeModeTypeRef}
            />
          ) : (
            <WriteAvailabilityTable
              eventId={eventData?.id as string}
              writeShape={availabilityState.writeShape}
              eventDays={eventData?.event_days as EventDay[]}
              timeArray={timeArray}
              writeModeTypeRef={writeModeTypeRef}
            />
          ))}

        {mode == "write" &&
          writeModeTypeRef.current == "edit" &&
          (eventData?.type == 1 ? (
            <WriteAvailabilityTable
              eventId={eventData?.id as string}
              writeShape={previousArrayRef.current}
              eventDates={eventData?.event_dates as EventDate[]}
              timeArray={timeArray}
              writeModeTypeRef={writeModeTypeRef}
            />
          ) : (
            <WriteAvailabilityTable
              eventId={eventData?.id as string}
              writeShape={previousArrayRef.current}
              eventDays={eventData?.event_days as EventDay[]}
              timeArray={timeArray}
              writeModeTypeRef={writeModeTypeRef}
            />
          ))}
      </div>

      {/* Responses */}
      {mode == "read" && (
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
                    onMouseEnter={() => {
                      previousArrayRef.current =
                        getSpecificRespondentAvailability(
                          respondent.id,
                          respondentAvailability
                        );
                      setIsHovering(true);
                    }}
                    onMouseLeave={() => {
                      previousArrayRef.current = availabilityState.readShape;
                      setIsHovering(false);
                    }}
                  >
                    <div className="flex flex-row gap-1 items-center">
                      <Smile size={16} />
                      <p className="text-sm group-hover:font-bold">
                        {respondent.name}
                      </p>
                    </div>

                    {/* Edit respondent's availabilities */}
                    <button
                      className="hidden group-hover:block"
                      onClick={() => {
                        localStorage.setItem(
                          `${EDITUSER}${eventData?.id}`,
                          respondent.id
                        );
                        writeModeTypeRef.current = "edit";
                        editRespondentNameRef.current =
                          getSpecificRespondentName(
                            respondent.id,
                            respondentAvailability
                          );
                        setMode("write");
                        setIsHovering(false);
                      }}
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
      )}
    </div>
  );
};

export default AvailabilityGrid;
