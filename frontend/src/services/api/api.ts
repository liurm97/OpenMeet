/**
 Handles or consumes API
 */

/*
create event
return status code
*/
export const BASE_REMOTE_URL = "http://127.0.0.1:8000/api/events";

export const createEvent = async (
  payload: any
): Promise<{
  status: number;
  data: singleEventResponseDataType;
}> => {
  const result = await fetch(BASE_REMOTE_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const resp = await result.json();
  return resp;
};

import { singleEventResponseDataType } from "@/types/type";
/*
get single event
if 200 OK:
 return {"data": {response_data}}

if 400 BAD REQUEST:
 return
 {
    "error": "Invalid data",
    "error description": f"You have provided invalid data. Please try again.",
 },
i
f 404 NOT FOUND:
 return
{
    "error": "Not found",
    "error description": f"The event_id `{event_id}` you entered does not exist.",
},

*/

export const getSingleEvent = async (
  eventId: string
): Promise<{
  status: number;
  data: singleEventResponseDataType;
}> => {
  //   const { eventId } = params;
  const result = await fetch(`${BASE_REMOTE_URL}/${eventId as string}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const resp = await result.json();
  return resp;
};
