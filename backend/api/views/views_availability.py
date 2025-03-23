"""
Views for Event Availabilities
"""

# models and serializers
from ..helpers import validate_auth_token
from ..serializers.serializers_availability import (
    AddSpecificEventAvailabilitySerializer,
    DeleteSpecificEventAvailabilitySerializer,
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
        """
        Handles POST API request
        """

        # Validate if auth token exists in header
        if validate_auth_token(request) == False:
            return Response(
                "Please provide a valid token", status=status.HTTP_401_UNAUTHORIZED
            )

        # get fields in data payload
        data = request.data

        data_to_serialize = {**data, **{"event_id": event_id}}
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
                # if user is signed in, to retrive user's id
                signed_in_user_id = data.get("signedInUserId") or None

                # if user is signed in, to retrieve user's full name.
                # Else, this will be name of guest respondent
                respondent_name = data.get("respondentName")

                respondent_array = data.get("respondentArray") or None
                isGuestRespondent = data.get("isGuestRespondent")

                # if user is signed in
                if signed_in_user_id is not None:
                    respondent_id = signed_in_user_id

                # else if user is not signed in
                else:
                    respondent_id = uuid4()

                created_respondent = Respondent.objects.create(
                    id=respondent_id,
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

    def delete(self, request, event_id):
        """
        Handles DELETE API request
        """

        # Validate if auth token exists in header
        if validate_auth_token(request) == False:
            return Response(
                "Please provide a valid token", status=status.HTTP_401_UNAUTHORIZED
            )

        # get fields in data payload
        data = request.data

        data_to_serialize = {**data, **{"event_id": event_id}}

        serializer = DeleteSpecificEventAvailabilitySerializer(data=data_to_serialize)

        if serializer.is_valid():
            # if event_id exists
            # For validation purpose only - Is not actually required to delete respondent record
            try:
                event_to_update = Event.objects.get(id=event_id)
            except Exception as e:
                return Response(
                    f"The event id you provided ({event_id} may not exist. Please try again.)",
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                respondent_id = data.get("respondentId")

                # delete respondent's availabilities from the event
                respondent_to_delete = Respondent.objects.filter(id=respondent_id)

                if len(respondent_to_delete) > 0:
                    respondent_to_delete.delete()
                    output = {"message": f"{respondent_id} is deleted successfully"}
                    return Response(output, status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response(
                        f"The respondent you provided ({respondent_id}) may not exist. Please try again.",
                        status=status.HTTP_404_NOT_FOUND,
                    )

                # prepare delete successful message

            except Exception as e:
                return Response(
                    f"{e.args}", status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        else:
            return Response(
                f"BAD REQUEST - {serializer.errors}",
                status=status.HTTP_400_BAD_REQUEST,
            )
