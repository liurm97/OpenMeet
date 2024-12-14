export type singleEventResponseDataType = {
  id: string;
  owner: string;
  name: string;
  type: number;
  startTime: string;
  endTime: string;
  eventDates: {
    date: string;
    dayOfWeek: string;
  }[];
} | null;
