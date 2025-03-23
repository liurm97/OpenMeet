import BinDialog from "@/components/(shared)/BinDialog";
import ReadOnlyAvailabilityTable from "@/components/(shared)/ReadOnlyAvailabilityTable";
import RespondentNameAndSmileIcon from "@/components/(shared)/RespondentNameAndSmileIcon";
import WriteAvailabilityTable from "@/components/(shared)/WriteAvailabilityTable";
import {
  DefaultDateTimeObjectType,
  EventDate,
  EventDay,
  GetSingleEventResponseDataTypeLocalFormatted,
  RespondentAvailabilityType,
} from "@/types/type";
import { EDITUSER } from "@/utils/constants";
import { useAuth } from "@clerk/clerk-react";
import { Pencil } from "lucide-react";
import React, { useState } from "react";

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
  previousArrayRef: React.MutableRefObject<boolean[][] | undefined>;
  editRespondentNameRef: React.MutableRefObject<string | undefined>;
}) => {
  {
    /* Availability Grid + Response section */
  }

  // Variables
  const respondentAvailability = availabilityState.respondentAvailability;
  const readCommonArray = availabilityState.common;

  // States
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Hooks
  const auth = useAuth();

  // Functions
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
            value={previousArrayRef.current as boolean[][]}
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
              writeShape={previousArrayRef.current as boolean[][]}
              eventDates={eventData?.event_dates as EventDate[]}
              timeArray={timeArray}
              writeModeTypeRef={writeModeTypeRef}
            />
          ) : (
            <WriteAvailabilityTable
              eventId={eventData?.id as string}
              writeShape={previousArrayRef.current as boolean[][]}
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
              {eventData?.event_respondents?.map((respondent, _ind: number) => (
                <div
                  key={`event_respondents_true_${_ind}`}
                  className="flex flex-row justify-between group"
                  onMouseEnter={() => {
                    const respondentId = respondent.id;

                    previousArrayRef.current =
                      getSpecificRespondentAvailability(
                        respondentId,
                        respondentAvailability
                      );
                    setIsHovering(true);
                  }}
                  onMouseLeave={() => {
                    previousArrayRef.current = availabilityState.readShape;
                    setIsHovering(false);
                  }}
                >
                  <RespondentNameAndSmileIcon
                    name={respondent.name}
                    isGuestRespondent={respondent.isGuestRespondent}
                  />

                  {/* Edit respondent's availabilities */}

                  {respondent.isGuestRespondent ? (
                    <div className="flex flex-row gap-2 items-center justify-end ">
                      <button
                        className="hidden group-hover:block"
                        onClick={() => {
                          const respondentId = respondent.id;

                          localStorage.setItem(
                            `${EDITUSER}${eventData?.id}`,
                            respondentId
                          );
                          writeModeTypeRef.current = "edit";
                          editRespondentNameRef.current =
                            getSpecificRespondentName(
                              respondentId,
                              respondentAvailability
                            );
                          setMode("write");
                          setIsHovering(false);
                        }}
                      >
                        <Pencil size={16} className="text-gray-500" />
                      </button>
                      <BinDialog
                        eventId={eventData?.id}
                        respondentName={respondent.name}
                        respondentId={respondent.id}
                      />
                    </div>
                  ) : auth.isSignedIn &&
                    `${auth.userId}:${eventData?.id}` == respondent.id ? (
                    <div className="flex flex-row gap-2 items-center justify-end ">
                      <button
                        className="hidden group-hover:block"
                        onClick={() => {
                          const respondentId = respondent.id;

                          localStorage.setItem(
                            `${EDITUSER}${eventData?.id}`,
                            respondentId
                          );
                          writeModeTypeRef.current = "edit";
                          editRespondentNameRef.current =
                            getSpecificRespondentName(
                              respondentId,
                              respondentAvailability
                            );
                          setMode("write");
                          setIsHovering(false);
                        }}
                      >
                        <Pencil size={16} className="text-gray-500" />
                      </button>

                      <BinDialog
                        eventId={eventData?.id}
                        respondentName={respondent.name}
                        respondentId={respondent.id}
                      />
                    </div>
                  ) : undefined}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityGrid;
