"""
Views for Event Availabilities
"""

# models and serializers
from ..helpers import validate_auth_token
from ..serializers.serializers_availability import (
    AddSpecificEventAvailabilitySerializer,
)
from ..models import Event, Respondent, Availability

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


class AddEventAvailabilityView(APIView):
    """
    View to add event availabilitiy
    """

    permission_classes = [AllowAny]

    def post(self, request, event_id):

        # Validate if auth token exists in header
        if validate_auth_token(request) == False:
            return Response(
                "Please provide a valid token", status=status.HTTP_401_UNAUTHORIZED
            )

        # get fields in data payload
        data = request.data

        print(f"data: {data}")

        data_to_serialize = {**data, **{"event_id": event_id}}
        print(data_to_serialize)
        serializer = AddSpecificEventAvailabilitySerializer(data=data_to_serialize)

        if serializer.is_valid():
            # if event_id exists
            try:
                event_to_update = Event.objects.get(id=event_id)
            except Exception as e:
                return Response(
                    f"The event id you provided ({event_id} may not exist. Please try again.)",
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                respondent_name = data.get("respondentName")
                respondent_array = data.get("respondentArray") or None
                isGuestRespondent = data.get("isGuestRespondent")

                # add respondent
                random_respondent_id = uuid4()
                created_respondent = Respondent.objects.create(
                    id=random_respondent_id,
                    name=respondent_name,
                    isGuestRespondent=isGuestRespondent,
                    respondentEvent=event_to_update,
                )

                created_respondent_id = created_respondent.id

                # add respondent availabilities
                if respondent_array is not None:
                    bulk_create_availability_list = []
                    for i in respondent_array:
                        random_availability_id = uuid4()
                        availability_payload = Availability(
                            id=random_availability_id,
                            time_utc=i.get("time_utc"),
                            respondentAvailability=created_respondent,
                        )
                        bulk_create_availability_list.append(availability_payload)
                    Availability.objects.bulk_create(bulk_create_availability_list)

                    respondent_availabilities = Availability.objects.filter(
                        respondentAvailability__id=created_respondent_id
                    ).values("time_utc")

                    output = {
                        "respondent_id": created_respondent.id,
                        "new_availabilities": respondent_availabilities,
                    }
                    return Response(output, status=status.HTTP_201_CREATED)

                # If respondent array is empty or None
                else:
                    output = {
                        "respondent_id": created_respondent_id,
                        "new_availabilities": [],
                    }

                    return Response(output, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response(
                    f"{e.args}", status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        else:
            return Response(
                f"BAD REQUEST - {serializer.errors}",
                status=status.HTTP_400_BAD_REQUEST,
            )
