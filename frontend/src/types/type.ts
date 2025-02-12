export type EventDate = {
  date: string | Date;
};

export type EventDay = {
  day: string | Date;
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
  // eventDates?:
};
