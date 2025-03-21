import { CheckCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  DefaultDateTimeObjectType,
  GetSingleEventResponseDataTypeLocalFormatted,
} from "@/types/type";
import { useRef, useState } from "react";
import { buildDefaultAvailabilityDateTimeObject } from "@/utils/availabilityAction";
import { toast } from "sonner";
import AvailabilityGrid from "@/layout/(shared)/AvailabilityGrid";
import {
  formatAvailabilityBooleanToString,
  formatDateRange,
} from "@/utils/formatter";
import AgendaDialog from "@/components/(shared)/AgendaDialog";
import EditEventNameDialog from "@/components/(shared)/EditEventNameDialog";
import SaveDialog from "@/components/(shared)/SaveDialog";
import {
  AVAILABILITYSTATE,
  EDITUSER,
  EDITUSERAVAILABILITY,
} from "@/utils/constants";
import { patchRespondentAvailabilityInEvent } from "@/services/api/api";
import { useNavigate } from "react-router-dom";

const AvailabilityBody = ({
  eventData,
}: {
  eventData: GetSingleEventResponseDataTypeLocalFormatted | null;
}) => {
  // Variables
  const type = eventData?.type as number;
  const eventId = eventData?.id as string;
  const eventAgenda = eventData?.agenda as string;
  const eventName = eventData?.name as string;
  const dateRange = formatDateRange(type, eventData);
  let availabilityState: DefaultDateTimeObjectType = JSON.parse(
    localStorage.getItem(`${AVAILABILITYSTATE}${eventId}`) as string
  );

  // useStates
  const [agenda, setAgenda] = useState<string>(eventAgenda);
  const [, setName] = useState<string>(eventName);
  const [mode, setMode] = useState<string>("read");
  const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  // Cache writeAvailabilityState & readAvailabilityState in localStorage to prevent time-consuming processing
  if (availabilityState == null) {
    availabilityState = buildDefaultAvailabilityDateTimeObject(
      type,
      eventData as GetSingleEventResponseDataTypeLocalFormatted
    );
    localStorage.setItem(
      `${AVAILABILITYSTATE}${eventId}`,
      JSON.stringify(availabilityState)
    );
  }

  // if availabilityState is not NULL then override existing

  // useRefs
  const writeModeTypeRef: React.MutableRefObject<undefined | string> =
    useRef(undefined);

  const editRespondentNameRef: React.MutableRefObject<undefined | string> =
    useRef(undefined);

  const previousArrayRef: React.MutableRefObject<boolean[][]> = useRef(
    availabilityState.readShape
  );

  /* Build time array and to pass to Availability component to render start time local and end time local */
  const timeArray = availabilityState.availability[0].map((_datetime, _ind) => {
    // Split datetime and get the time value. i.e -> 10:00, 11:00, 12:00
    const splitted = _datetime.split(" ");
    const time = splitted[splitted.length - 1];

    // Push time ending with `00` to timeArray. i.e -> 10:00, 11:00, 12:00
    if (_ind % 2 == 0) {
      return time;
    }
  }) as string[];

  // Handler functions

  const handleEditRespondentAvailabilities = async (
    eventId: string,
    respondentId: string,
    respondentArray: boolean[][]
  ) => {
    console.log(eventId);
    console.log(respondentId);
    console.log(respondentArray);

    try {
      // setIsLoading(true);
      const formattedRespondentStringArray: string[] =
        formatAvailabilityBooleanToString(
          type,
          respondentArray,
          availabilityState.availability
        );
      const response = await patchRespondentAvailabilityInEvent(
        eventId,
        "respondentAvailability",
        respondentId,
        formattedRespondentStringArray
      );
      navigate(0);

      // throw error if not OK
    } catch (error) {
      // catch error here if not OK
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
  };

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
              <span className="text-gray-600 text-[13px]">
                {dateRange as string}
              </span>
            </div>

            {/* Agenda */}
            <div className="flex flex-col justify-center py-1">
              <p>
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

          {/* Copy link + Add Availability section + Add/respondent availbility display */}
          <div className="flex items-center gap-2 justify-center flex-col">
            <div className="flex flex-row gap-2 [@media(max-width:770px)]:flex-col">
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
                        <span className="font-bold">
                          {window.location.href}
                        </span>
                      </p>
                    </div>
                  );
                }}
              >
                <Copy />
                <span>Copy link</span>
              </Button>

              {/* Add Availability*/}
              {mode == "read" && (
                <Button
                  className="bg-black text-white hover:bg-gray-800 flex flex-row"
                  onClick={() => {
                    setMode("write");
                    writeModeTypeRef.current = "add";
                  }}
                >
                  {" "}
                  <Plus /> <span>Availability</span>
                </Button>
              )}

              {/* Cancel button */}
              {mode == "write" &&
                (writeModeTypeRef.current == "add" ||
                  writeModeTypeRef.current == "edit") && (
                  <div className="flex flex-row gap-2">
                    <Button
                      className="bg-white border-red-500 border text-red-500 hover:bg-red-100 flex flex-row"
                      onClick={() => {
                        previousArrayRef.current = availabilityState.readShape;
                        setMode("read");
                        writeModeTypeRef.current = undefined;
                        editRespondentNameRef.current = undefined;
                      }}
                    >
                      {" "}
                      <span>Cancel</span>
                    </Button>

                    {/* Save availabilities action */}
                    {/* If write mode is add then renders <SaveDialog/> component */}
                    {/* Else if write mode is edit then renders <Button/> component */}
                    {writeModeTypeRef.current == "add" ? (
                      // Add
                      <SaveDialog eventId={eventId} />
                    ) : (
                      // Edit
                      <Button
                        className="bg-white border-green-500 border text-green-500 hover:bg-green-100"
                        onClick={() => {
                          const editRespondentId = localStorage.getItem(
                            `${EDITUSER}${eventId}`
                          );
                          const editRespondentArray = JSON.parse(
                            localStorage.getItem(
                              `${EDITUSERAVAILABILITY}${eventId}`
                            ) as string
                          );
                          handleEditRespondentAvailabilities(
                            eventId,
                            editRespondentId as string,
                            editRespondentArray as boolean[][]
                          );
                        }}
                      >
                        <span>Save</span>
                      </Button>
                    )}
                  </div>
                )}
            </div>
            {mode == "write" && writeModeTypeRef.current == "edit" && (
              <p className="italic text-sm">
                Editing {editRespondentNameRef.current}'s availabilities
              </p>
            )}
          </div>
        </div>

        {/* Availability Grid + Response section */}
        <AvailabilityGrid
          availabilityState={availabilityState}
          eventData={eventData as GetSingleEventResponseDataTypeLocalFormatted}
          timeArray={timeArray}
          mode={mode}
          setMode={setMode}
          writeModeTypeRef={writeModeTypeRef}
          previousArrayRef={previousArrayRef}
          editRespondentNameRef={editRespondentNameRef}
        />
      </div>
    </main>
  );
};

export default AvailabilityBody;

/*


*/
