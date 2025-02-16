export type EventDate = {
  date: string | Date;
};

export type EventDay = {
  day: string | Date;
};

export type EventTime = {
  time: string;
};

export type EventAvailability = {
  respondent_id: string;
  respondent_name: string;
  availabilities: EventTime[] | [];
};

export type EventRespondent = {
  id: string;
  name: string;
  isGuestRespondent: boolean;
};

export type CreateEventResponseDataType = {
  id: string;
  owner: string;
  name: string;
  type: number;
  start_time_utc: string;
  end_time_utc: string;
};

export type CreateEventRequestPayloadType = {
  id: string;
  name: string;
  owner: string;
  type: number;
  start_time_utc: string;
  end_time_utc: string;
  eventDays?: EventDay[];
  eventDates?: EventDate[];
};

export type GetSingleEventResponseDataTypeUTC =
  | {
      id: string;
      name: string;
      owner: string;
      type: number;
      start_time_utc: string;
      end_time_utc: string;
      event_respondents: EventRespondent[] | [] | undefined;
      event_availabilities: EventAvailability[] | [] | undefined;
      event_dates?: EventDate[];
      event_days?: EventDay[];
    }
  | undefined;

export type GetSingleEventResponseDataTypeLocal =
  | {
      id: string;
      name: string;
      owner: string;
      type: number;
      start_time_local: string;
      end_time_local: string;
      event_respondents: EventRespondent[] | [] | undefined;
      event_availabilities: EventAvailability[] | [] | undefined;
      event_dates?: EventDate[];
      event_days?: EventDay[];
    }
  | undefined;

export type DefaultDateTimeObjectType = {
  shape: boolean[][];
  availability: string[][];
};
