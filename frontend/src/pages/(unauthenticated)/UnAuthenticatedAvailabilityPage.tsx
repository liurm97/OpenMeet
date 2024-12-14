import UnAuthenticatedAvailabilityBody from "@/layout/(unauthenticated)/UnAuthenticatedAvailabilityBody";
import UnAuthenticatedSecondaryHeader from "@/layout/(unauthenticated)/UnAuthenticatedSecondaryHeader";
import { getSingleEvent } from "@/services/api/api";
import { singleEventResponseDataType } from "@/types/type";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UnAuthenticatedAvailabilityPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const eventId = params.eventId;
  const [eventData, setEventData] = useState<singleEventResponseDataType>(null);

  useEffect(() => {
    const fetchData = async () => {
      const eventResponse = await getSingleEvent(eventId as string);
      if (eventResponse.status == 200) {
        setEventData(eventResponse.data);
      } else {
        navigate("/-/notfound", { replace: true });
      }
    };
    fetchData();
  }, [eventId, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <UnAuthenticatedSecondaryHeader />
      <UnAuthenticatedAvailabilityBody eventData={eventData} />
    </div>
  );
};

export default UnAuthenticatedAvailabilityPage;
