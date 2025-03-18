import Header from "@/components/(shared)/Header";
import AvailabilityBody from "@/layout/(shared)/AvailabilityBody";
import { GetSingleEventResponseDataTypeLocal } from "@/types/type";

import { useState } from "react";
import { useParams, useLoaderData } from "react-router-dom";

const AvailabilityPage = () => {
  const { eventId } = useParams();
  const loadedData: GetSingleEventResponseDataTypeLocal = useLoaderData();
  console.log(`AvailabilityPage:: eventId:: ${eventId}`);

  const [eventData, setEventData] =
    useState<GetSingleEventResponseDataTypeLocal | null>(loadedData);

  console.log(`eventData:: ${JSON.stringify(eventData)}`);

  return (
    <div className="min-h-screen flex flex-col">
      {/* < /> */}
      <Header />
      <AvailabilityBody eventData={eventData} />
    </div>
  );
};

export default AvailabilityPage;
