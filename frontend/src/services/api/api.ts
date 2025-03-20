/**
 Handles or consumes API
 */

import {
  CreateEventRequestPayloadType,
  CreateEventResponseDataType,
  GetSingleEventResponseDataTypeUTC,
  PatchSingleEventResponseType,
} from "@/types/type";

// API token
export const PRIVATE_API_TOKEN = "1bc84a76-57f0-4678-82a0-9092c2edf8c5";

export const BASE_REMOTE_URL = "http://127.0.0.1:8000/api/v1";

export const createEvent = async (
  payload: CreateEventRequestPayloadType
): Promise<{
  status: number;
  data: CreateEventResponseDataType;
}> =>
  /*
    1. OnSubmit triggers create event action when user clicks on Create event CTA button
    2. Calls POST /api/v1/events endpoint
      - Validates request payload
      - Inserts record into Events db
      - Returns response
      */
  {
    const result = await fetch(`${BASE_REMOTE_URL}/events`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: PRIVATE_API_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const resp = await result.json();
    const status = result.status;
    console.log(`createEvent:: status:: ${status} | resp:: ${resp}`);
    return {
      status: status,
      data: resp,
    };
  };

export const getSingleEvent = async (
  eventId: string
): Promise<{
  status: number;
  data: GetSingleEventResponseDataTypeUTC;
}> => {
  const result = await fetch(`${BASE_REMOTE_URL}/events/${eventId as string}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: PRIVATE_API_TOKEN,
    },
  });

  const status = result.status;
  const resp = await result.json();
  return {
    status: status,
    data: resp,
  };
};

export const patchSingleEvent = async (
  text: string,
  field: string,
  eventId: string
): Promise<{
  status: number;
  data: PatchSingleEventResponseType;
}> => {
  const result = await fetch(`${BASE_REMOTE_URL}/events/${eventId as string}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: PRIVATE_API_TOKEN,
    },
    body: JSON.stringify({
      text: text,
      field: field,
    }),
  });

  const status = result.status;
  const resp = await result.json();
  return {
    status: status,
    data: resp,
  };
};
