"""
Views for Events
"""

# models and serializers
from ..serializers.serializers_day import DaySerializer
from ..models import Event, Date, Day, Respondent, Availability
from ..serializers.serializers_event import (
    CreateEventRequestBodyFieldSerializer,
    CreateEventSerializer,
    GetSpecificEventRequestSerializer,
)
from ..serializers.serializers_date import DateSerializer

# django libraries
from django.http import JsonResponse
from django.core.exceptions import *

# rest framework libraries
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.exceptions import *
from rest_framework.views import APIView

# other libraries
from uuid import uuid4


class CreateEventView(APIView):
    """
    View to create new event
    """

    def post(self, request, format=None):
        # serialize and validate fields in request body
        requestBodySerializer = CreateEventRequestBodyFieldSerializer(data=request.data)
        if requestBodySerializer.is_valid():

            data = request.data
            print(f"request.data:: {data}")
            serializer = CreateEventSerializer(data=data)

            try:
                # serialize and validate Event payload

                # if Event payload is valid
                if serializer.is_valid():
                    print("valid")

                    # create event
                    created_event = serializer.save()
                    print(f"created_event:: {created_event}")

                    created_event_id = created_event.id
                    print(f"created_event_id:: {created_event_id}")

                    # get `type` field value
                    type = data["type"]
                    print(f"type:: {type}")

                    # if `type` = 1, serialize and validate Date payload
                    if type == 1:
                        eventDates: list[object] = data["eventDates"]
                        dateSerializer = DateSerializer(
                            data=eventDates,
                            many=True,
                        )
                        # save created_event to dateSerializer context
                        dateSerializer.context["created_event"] = created_event

                        if dateSerializer.is_valid():
                            print("dateSerializer is valid")
                            dateSerializer.save()

                            return Response(
                                serializer.validated_data,
                                status=status.HTTP_201_CREATED,
                            )

                        else:
                            return Response(
                                dateSerializer.errors,
                                status=status.HTTP_400_BAD_REQUEST,
                            )

                    # if `type`` = 2, serialize and validate Day payload
                    if type == 2:
                        eventDays: list[object] = data["eventDays"]
                        daySerializer = DaySerializer(
                            data=eventDays,
                            many=True,
                        )
                        # save created_event to serializer context
                        daySerializer.context["created_event"] = created_event

                        if daySerializer.is_valid():
                            print("dateSerializer is valid")
                            daySerializer.save()

                            return Response(
                                request.data, status=status.HTTP_201_CREATED
                            )

                        else:
                            return Response(
                                daySerializer.errors,
                                status=status.HTTP_400_BAD_REQUEST,
                            )

                # Serialize and validate Event specific payload
                # if Event payload is NOT valid
                else:
                    print("not valid")
                    return Response(
                        serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except Exception as e:
                return Response(
                    f"Something wrong happened. Please try again.\n{e}",
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            print(requestBodySerializer.errors)
            return Response(
                requestBodySerializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )


class GetSpecificEventView(APIView):
    """
    View to get specific event by event id
    """

    """
    --- Steps ---

    # 1. serialize and validate `event_id` is a valid UUID field

    # 2. get `type` field of the specific event

    # 3. check `type` field value

        # 3.1 if `type` == 1:

            # 3.1.1 query Date table by event.id == <event_id>

            # 3.1.2 query Respondent table by respondentEvent.id == <event_id>

            # 3.1.3 query Availability table by respondentAvailability.id == Respondent.id

        # 3.2 if `type` == 2:

            # 3.2.1 query Day table by event.id == <event_id>

            # 3.2.1 query Respondent table by respondentEvent.id == <event_id>

            # 3.2.3 query Availability table by respondentAvailability.id == Respondent.id
    """

    def get(self, request, event_id, format=None):

        # verify event_id is valid UUID
        serializer = GetSpecificEventRequestSerializer(data={"event_id": event_id})

        # if event_id is valid UUID
        if serializer.is_valid():
            print(serializer.validated_data)

            try:
                # check to see if event_id exists
                result = Event.objects.get(pk=str(event_id))
                type = result.type
                owner = result.owner
                start_time_utc = result.start_time_utc
                end_time_utc = result.end_time_utc

                # query Respondent table by respondentEvent.id == <event_id>
                event_respondents: list[object] = (
                    Respondent.objects.select_related("respondentEvent")
                    .filter(respondentEvent_id=event_id)
                    .values("id", "name", "isGuestRespondent")
                )

                event_respondents_availabilities = []

                # loop through all respondents in a single event
                for respondent in event_respondents:
                    id = respondent["id"]
                    name = respondent["name"]
                    print(f"respondent id {id} name {name}")

                    # get availability time for each respondent in a single event
                    respondents_availabilities = (
                        Availability.objects.select_related("respondentAvailability")
                        .filter(respondentAvailability_id=id)
                        .values("time")
                    )
                    event_respondents_availabilities.append(
                        {
                            "respondent_id": id,
                            "respondent_name": name,
                            "availabilities": respondents_availabilities,
                        }
                    )

                if type == 1:
                    # query Date table by event.id == <event_id>
                    event_dates = (
                        Date.objects.select_related("event")
                        .filter(event_id=event_id)
                        .order_by("date")
                        .values("date")
                    )

                    return Response(
                        {
                            "id": event_id,
                            "owner": owner,
                            "type": type,
                            "start_time_utc": start_time_utc,
                            "end_time_utc": end_time_utc,
                            "event_respondents": event_respondents,
                            "event_dates": event_dates,
                            "event_availabilities": event_respondents_availabilities,
                        },
                        status=status.HTTP_200_OK,
                    )

                # 3.1.2 query Respondent table by respondentEvent.id == <event_id>

                if type == 2:
                    event_days = (
                        Day.objects.select_related("event")
                        .filter(event_id=event_id)
                        .order_by("day")
                        .values("day")
                    )

                    return Response(
                        {
                            "id": event_id,
                            "owner": owner,
                            "type": type,
                            "start_time_utc": start_time_utc,
                            "end_time_utc": end_time_utc,
                            "event_respondents": event_respondents,
                            "event_days": event_days,
                            "event_availabilities": event_respondents_availabilities,
                        },
                        status=status.HTTP_200_OK,
                    )

            except Exception:
                return Response(
                    f"Event id {event_id} does not exist",
                    status=status.HTTP_404_NOT_FOUND,
                )

        else:
            return Response(
                f"{event_id} is not a valid UUID", status=status.HTTP_400_BAD_REQUEST
            )

    #     return Response("success")

    # if serializer.is_valid():
    #     print("valid")
    #     try:
    #         print("in try statement")
    #         serializer.save()
    #         print(f"after save serializer.data:: {serializer.data}")
    #         return Response(
    #             serializer.validated_data, status=status.HTTP_201_CREATED
    #         )

    #     except Exception as e:
    #         return Response(
    #             f"Something wrong happened. Please try again.\n{e}",
    #             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         )
    # else:
    #     print("not valid")
    #     return Response(
    #         serializer.errors,
    #         status=status.HTTP_400_BAD_REQUEST,
    #     )
