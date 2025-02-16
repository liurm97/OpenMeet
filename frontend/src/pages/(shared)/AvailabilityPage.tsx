import UnAuthenticatedAvailabilityBody from "@/layout/(unauthenticated)/UnAuthenticatedAvailabilityBody";
import UnAuthenticatedSecondaryHeader from "@/layout/(unauthenticated)/UnAuthenticatedSecondaryHeader";
import { GetSingleEventResponseDataTypeLocal } from "@/types/type";

import { useState } from "react";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";

const AvailabilityPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const loadedData: GetSingleEventResponseDataTypeLocal = useLoaderData();
  console.log(`AvailabilityPage:: eventId:: ${eventId}`);

  const [eventData, setEventData] =
    useState<GetSingleEventResponseDataTypeLocal | null>(loadedData);

  console.log(`eventData:: ${JSON.stringify(eventData)}`);

  return (
    <div className="min-h-screen flex flex-col">
      <UnAuthenticatedSecondaryHeader />
      <UnAuthenticatedAvailabilityBody eventData={eventData} />
    </div>
  );
};

export default AvailabilityPage;
