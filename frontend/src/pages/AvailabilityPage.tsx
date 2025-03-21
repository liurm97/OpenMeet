import Header from "@/components/(shared)/Header";
import AvailabilityBody from "@/layout/(shared)/AvailabilityBody";
import { EventAvailability, EventTimeUTC } from "@/types/type";
import { EVENTDATA, USERID } from "@/utils/constants";
import { formatDayTimeStringUTC } from "@/utils/formatter";
import { useAuth, useUser } from "@clerk/clerk-react";
import dayjs from "dayjs";

import { useEffect } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { Toaster } from "sonner";

const AvailabilityPage = () => {
  const { isSignedIn } = useUser();
  const auth = useAuth();
  const eventData = useLoaderData();
  const { eventId } = useParams();

  console.log(eventId);

  // make a deep copy of eventData and format event_availabilities array: time_utc -> time_local
  const formattedEventData = JSON.parse(JSON.stringify(eventData));

  useEffect(() => {
    // If user is authenticated - save userId in localStorage
    if (isSignedIn)
      localStorage.setItem(`${USERID}${eventId}`, auth.userId as string);
    // Else clear userId in localStorage
    else localStorage.removeItem(USERID);

    // cache formattedEvent in localStorage
    localStorage.setItem(
      `${EVENTDATA}${eventId}`,
      JSON.stringify(formattedEventData)
    );
  }, []);

  // Add time_local to all availabilities
  const eventType = eventData?.type;

  // if type = dates
  if (eventType === 1) {
    formattedEventData?.event_availabilities?.forEach(
      (respondent: EventAvailability) => {
        const respondentAvailabilities: EventTimeUTC[] =
          respondent.availabilities;
        respondentAvailabilities.forEach(
          (availability: EventTimeUTC, _ind: number) => {
            const utcDatetime = availability.time_utc;
            const localDatetime = dayjs(
              new Date(`${utcDatetime} UTC`).toString()
            ).format("YYYY-MM-DD HH:mm");
            Object.assign(respondentAvailabilities[_ind], {
              time_local: localDatetime,
            });
            delete respondentAvailabilities[_ind]["time_utc"];
          }
        );
      }
    );
  }
  // if type = days
  else if (eventType === 2) {
    formattedEventData?.event_availabilities?.forEach(
      (respondent: EventAvailability) => {
        const respondentAvailabilities: EventTimeUTC[] =
          respondent.availabilities;
        respondentAvailabilities.forEach(
          (availability: EventTimeUTC, _ind: number) => {
            const utcDaytime = availability.time_utc;
            const localDaytime = formatDayTimeStringUTC(utcDaytime as string);
            Object.assign(respondentAvailabilities[_ind], {
              time_local: localDaytime,
            });
            delete respondentAvailabilities[_ind]["time_utc"];
          }
        );
      }
    );
  }

  if (eventType)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <AvailabilityBody eventData={formattedEventData} />
        <Toaster />
      </div>
    );
};

export default AvailabilityPage;
