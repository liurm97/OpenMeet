export type EventDate = {
  date: string | Date;
};

export type EventDay = {
  day: string | Date;
};

export type EventTimeUTC = {
  time_utc?: string;
};

export type EventTimeLocal = {
  time_local: string;
};

export type EventAvailability = {
  respondent_id: string;
  respondent_name: string;
  availabilities: EventTimeUTC[] | [];
};

export type EventAvailabilityFormatted = {
  respondent_id: string;
  respondent_name: string;
  availabilities: EventTimeLocal[] | [];
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
      agenda: string;
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
      agenda: string;
      start_time_local: string;
      end_time_local: string;
      event_respondents: EventRespondent[] | [] | undefined;
      event_availabilities: EventAvailability[] | [] | undefined;
      event_dates?: EventDate[];
      event_days?: EventDay[];
    }
  | undefined;

export type GetSingleEventResponseDataTypeLocalFormatted =
  | {
      id: string;
      name: string;
      owner: string;
      type: number;
      agenda: string;
      start_time_local: string;
      end_time_local: string;
      event_respondents: EventRespondent[] | [] | undefined;
      event_availabilities: EventAvailabilityFormatted[] | [] | undefined;
      event_dates?: EventDate[];
      event_days?: EventDay[];
    }
  | undefined;

export type RespondentAvailabilityType = {
  id: string;
  name: string;
  availability: boolean[][];
};

export type DefaultDateTimeObjectType = {
  readShape: boolean[][];
  writeShape: boolean[][];
  common: number[][];
  availability: string[][];
  respondentAvailability: RespondentAvailabilityType[];
};

export type PatchSingleEventResponseType = {
  event_id: string;
  previous_agenda?: string;
  new_agenda?: string;
  previous_event_name?: string;
  new_event_name?: string;
};
