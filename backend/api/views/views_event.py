"""
Views for Events
"""

# models and serializers
from ..serializers.serializers_day import DaySerializer
from ..models import Event, Date, Day, Respondent, Availability
from ..serializers.serializers_event import (
    CreateEventRequestBodySerializer,
    CreateEventSerializer,
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
        requestBodySerializer = CreateEventRequestBodySerializer(data=request.data)
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
                        # save created_event to serializer context
                        dateSerializer.context["created_event"] = created_event

                        if dateSerializer.is_valid():
                            print("dateSerializer is valid")
                            dateSerializer.save()

                            return Response(
                                request.data, status=status.HTTP_201_CREATED
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

    pass
    # def get(self, request, event_id, format=None):
    #     print(f"event_id:: {event_id}")
    #     serializer = GetSpecificEventSerializer(data=event_id)
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
