import Header from "@/components/(shared)/Header";
import AvailabilityBody from "@/layout/(shared)/AvailabilityBody";
import { GetSingleEventResponseDataTypeLocal } from "@/types/type";
import { USERID } from "@/utils/constants";
import { useAuth, useUser } from "@clerk/clerk-react";

import { useEffect, useState } from "react";
import { useParams, useLoaderData } from "react-router-dom";
import { Toaster } from "sonner";

const AvailabilityPage = () => {
  const { eventId } = useParams();
  const { isSignedIn } = useUser();
  const auth = useAuth();
  const loadedData: GetSingleEventResponseDataTypeLocal = useLoaderData();
  console.log(`AvailabilityPage:: eventId:: ${eventId}`);

  useEffect(() => {
    // If user is authenticated - save userId in localStorage
    if (isSignedIn) localStorage.setItem(USERID, auth.userId as string);
    // Else clear userId in localStorage
    else localStorage.removeItem(USERID);
  }, []);

  const [eventData, setEventData] =
    useState<GetSingleEventResponseDataTypeLocal | null>(loadedData);

  console.log(`eventData:: ${JSON.stringify(eventData)}`);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Receives event data to dynamically render event details */}
      <AvailabilityBody eventData={eventData} />
      <Toaster />
    </div>
  );
};

export default AvailabilityPage;
