import { getSingleEvent } from "@/services/api/api";
import {
  EventDate,
  EventDay,
  GetSingleEventResponseDataTypeLocal,
} from "@/types/type";
import { formatCalendarDateLocal, formatCalendarTimeLocal } from "./formatter";

export const fetchSingleEventData = async (eventId: string) => {
  const eventResponse = await getSingleEvent(eventId);
  const eventResponseData = eventResponse.data;
  if (eventResponse.status == 200) {
    let formattedEventResponse: GetSingleEventResponseDataTypeLocal;
    let eventDates: EventDate[] | undefined;
    let eventDays: EventDay[] | undefined;
    const { data } = eventResponse;
    const id = data?.id as string;
    const owner = data?.owner as string;
    const name = data?.name as string;
    const eventRespondent = data?.event_respondents;
    const eventAvailabilities = data?.event_availabilities;
    const utcStartTime = data?.start_time_utc;
    const localStartTime = formatCalendarTimeLocal(utcStartTime!);
    const utcEndTime = data?.end_time_utc;
    const localEndTime = formatCalendarTimeLocal(utcEndTime!);
    const type = data?.type as number;
    if (type == 1) {
      eventDates = data?.event_dates?.map((_date) => {
        const date = _date.date as Date;
        const formattedDate = formatCalendarDateLocal(date, utcStartTime!);
        return {
          date: formattedDate,
        };
      });
      formattedEventResponse = {
        ...{
          id: id,
          owner: owner,
          name: name,
          type: type,
          event_respondents: eventRespondent,
          start_time_local: localStartTime,
          end_time_local: localEndTime,
          event_dates: eventDates,
          event_availabilities: eventAvailabilities,
        },
      };
    } else if (type == 2) {
      eventDays = data?.event_days?.map((_day) => {
        const day = _day.day as string;
        return {
          day: day,
        };
      });
      formattedEventResponse = {
        ...{
          id: id,
          owner: owner,
          name: name,
          type: type,
          event_respondents: eventRespondent,
          start_time_local: localStartTime,
          end_time_local: localEndTime,
          event_days: eventDays,
          event_availabilities: eventAvailabilities,
        },
      };
    }

    return formattedEventResponse;
  }
};
