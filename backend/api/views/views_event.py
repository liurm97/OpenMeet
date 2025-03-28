"""
Views for Events
"""

# models and serializers
from ..helpers import validate_auth_token
from ..serializers.serializers_day import DaySerializer
from ..models import Event, Date, Day, Respondent, Availability
from ..serializers.serializers_event import (
    CreateEventRequestBodyFieldSerializer,
    CreateEventSerializer,
    GetSpecificEventRequestSerializer,
    UpdateSpecificEventRequestSerializer,
)
from ..serializers.serializers_date import DateSerializer

# django libraries
from django.core.exceptions import *

# rest framework libraries
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import *
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny


# other libraries
from uuid import uuid4


class CreateEventView(APIView):
    """
    View to create new event
    """

    permission_classes = [AllowAny]

    def post(self, request, format=None):
        """
        Handle POST request
        """

        if validate_auth_token(request) == False:
            return Response(
                "Please provide a valid token", status=status.HTTP_401_UNAUTHORIZED
            )  # serialize and validate fields in request body

        requestBodySerializer = CreateEventRequestBodyFieldSerializer(data=request.data)
        if requestBodySerializer.is_valid():

            data = request.data
            serializer = CreateEventSerializer(data=data)

            try:
                # serialize and validate Event payload

                # if Event payload is valid
                if serializer.is_valid():
                    # create event
                    created_event = serializer.save()

                    created_event_id = created_event.id

                    # get `type` field value
                    type = data["type"]

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
                    return Response(
                        serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except Exception as e:
                return Response(
                    f"Something wrong happened. Please try again.\nError:{e}",
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                requestBodySerializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )


class SpecificEventView(APIView):

    permission_classes = [AllowAny]
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
        """
        Handle GET request
        """

        if validate_auth_token(request) == False:
            return Response(
                "Please provide a valid token", status=status.HTTP_401_UNAUTHORIZED
            )

        # verify the provided event_id param is a valid UUID
        request_serializer = GetSpecificEventRequestSerializer(
            data={"event_id": event_id}
        )

        # if event_id is valid UUID
        if request_serializer.is_valid():

            try:
                # if event_id exists
                event = Event.objects.get(pk=str(event_id))
                event_name = event.name
                type = event.type
                owner = event.owner
                start_time_utc = event.start_time_utc
                end_time_utc = event.end_time_utc
                agenda = event.agenda

                # get related respondents of an event
                event_respondents: list[object] = (
                    Respondent.objects.select_related("respondentEvent")
                    .filter(respondentEvent_id=event_id)
                    .values("id", "name", "isGuestRespondent")
                )

                # get availability of all respondents of an event
                event_respondents_availabilities = []

                # loop through all respondents in a single event
                for respondent in event_respondents:
                    id = respondent["id"]
                    name = respondent["name"]

                    # get availability time for each respondent in a single event
                    respondents_availabilities = (
                        Availability.objects.select_related("respondentAvailability")
                        .filter(respondentAvailability_id=id)
                        .order_by("time_utc")
                        .values("time_utc")
                    )
                    event_respondents_availabilities.append(
                        {
                            "respondent_id": id,
                            "respondent_name": name,
                            "availabilities": respondents_availabilities,
                        }
                    )

                # get specific_dates
                if type == 1:
                    # get related dates of an event
                    event_dates = (
                        Date.objects.select_related("event")
                        .filter(event_id=event_id)
                        .order_by("date")
                        .values("date")
                    )

                    response_data = {
                        "id": event_id,
                        "name": event_name,
                        "owner": owner,
                        "type": type,
                        "agenda": agenda,
                        "start_time_utc": start_time_utc,
                        "end_time_utc": end_time_utc,
                        "event_respondents": event_respondents,
                        "event_dates": event_dates,
                        "event_availabilities": event_respondents_availabilities,
                    }

                # get day_of_weeks
                if type == 2:
                    # get related days of an event
                    event_days = (
                        Day.objects.select_related("event")
                        .filter(event_id=event_id)
                        .order_by("day")
                        .values("day")
                    )

                    response_data = {
                        "id": event_id,
                        "name": event_name,
                        "owner": owner,
                        "type": type,
                        "agenda": agenda,
                        "start_time_utc": start_time_utc,
                        "end_time_utc": end_time_utc,
                        "event_respondents": event_respondents,
                        "event_days": event_days,
                        "event_availabilities": event_respondents_availabilities,
                    }

                    # Check that response data has the required fields and field values
                return Response(
                    response_data,
                    status=status.HTTP_200_OK,
                )

            # if event_id does not exist
            except Exception:
                return Response(
                    f"Event id {event_id} does not exist",
                    status=status.HTTP_404_NOT_FOUND,
                )

        # if event_id is not a valid uuid
        else:
            return Response(
                f"Event id {event_id} is not a valid event_id",
                status=status.HTTP_400_BAD_REQUEST,
            )

    def patch(self, request, event_id):

        # get fields in data payload

        # required fields
        field = request.data.get("field")

        # optional fields depending on the field that is being updated
        text = request.data.get("text") or None
        respondent_id = request.data.get("respondentId") or None
        respondent_array = request.data.get("respondentArray") or None

        # Validate if auth token exists in header
        if validate_auth_token(request) == False:
            return Response(
                "Please provide a valid token", status=status.HTTP_401_UNAUTHORIZED
            )

        else:
            # Validate if the required fields are provided
            request_serializer = UpdateSpecificEventRequestSerializer(
                data={"event_id": event_id, "field": field}
            )

            if request_serializer.is_valid():
                # if event_id exists
                try:
                    event_to_update = Event.objects.filter(id=event_id)

                    if field == "agenda":
                        existing_agenda_val = event_to_update.values("agenda")[0].get(
                            "agenda"
                        )
                        event_to_update.update(agenda=text)
                        updated_event_obj = {
                            "event_id": Event.objects.get(id=event_id).id,
                            "previous_agenda": existing_agenda_val,
                            "new_agenda": Event.objects.get(id=event_id).agenda,
                        }
                    elif field == "name":
                        existing_name_val = event_to_update.values("name")[0].get(
                            "name"
                        )
                        event_to_update.update(name=text)
                        updated_event_obj = {
                            "event_id": Event.objects.get(id=event_id).id,
                            "previous_event_name": existing_name_val,
                            "new_event_name": Event.objects.get(id=event_id).name,
                        }
                    elif field == "respondentAvailability":

                        # delete all respondent's availabilities
                        Availability.objects.filter(
                            respondentAvailability__id=respondent_id
                        ).delete()

                        # iterate through new availabilities and insert into Availabilities table

                        target_respondent = Respondent.objects.get(id=respondent_id)
                        if respondent_array is not None:
                            bulk_create_availability_list = []
                            for i in respondent_array:
                                random_availability_id = uuid4()
                                availability_payload = Availability(
                                    id=random_availability_id,
                                    time_utc=i.get("time_utc"),
                                    respondentAvailability=target_respondent,
                                )
                                bulk_create_availability_list.append(
                                    availability_payload
                                )
                            Availability.objects.bulk_create(
                                bulk_create_availability_list
                            )
                            new_availabilities = Availability.objects.filter(
                                respondentAvailability__id=respondent_id
                            ).values("time_utc")

                            updated_event_obj = {
                                "respondent_id": target_respondent.id,
                                "new_availabilities": new_availabilities,
                            }
                            return Response(
                                updated_event_obj, status=status.HTTP_200_OK
                            )

                        # If respondent array is empty or None
                        else:
                            updated_event_obj = {
                                "respondent_id": target_respondent.id,
                                "new_availabilities": [],
                            }
                    return Response(updated_event_obj, status=status.HTTP_200_OK)

                except Exception as e:
                    return Response(
                        f"The event_id ({event_id}) you provided may not exist. Please try again.",
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            else:
                return Response(
                    f"NOT OK {request_serializer.errors}",
                    status=status.HTTP_400_BAD_REQUEST,
                )
