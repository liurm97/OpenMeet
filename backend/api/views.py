"""
Views for API
"""

# models and serializers
from .models import Event, Date
from .serializers import ListAllEventSerializer, ListEventSerializer

# django libraries
from django.http import JsonResponse
from django.shortcuts import render
from django.core.exceptions import *

# rest framework libraries
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework import generics, viewsets
from rest_framework.exceptions import *


# adhoc libraries
from uuid import uuid4


@api_view(["GET", "POST"])
def get_all_or_create_event(request):
    """
    View to get all events or create an event
    """
    if request.method == "GET":
        events = Event.objects.all()
        serializer = ListAllEventSerializer(events, many=True)
        return JsonResponse({"data": serializer.data}, status=200)

    elif request.method == "POST":
        data = request.data
        print(f"data:: {data}")
        serializer = ListAllEventSerializer(
            data=data,
        )
        if serializer.is_valid():
            print(f"serializer.validated_data:: {serializer.validated_data}")
            serializer.save()
            return JsonResponse(
                {"status": 200, "data": serializer.data}, status=status.HTTP_201_CREATED
            )
        else:
            return JsonResponse(
                {"status": 400, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )


@api_view(["GET"])
def get_event_by_pk(request, event_id: str):
    """
    View to get an event by event_id
    """
    print(f"event_id:: {event_id}")
    try:
        event = Event.objects.get(pk=event_id)
        serializer = ListEventSerializer(event)
        return JsonResponse(
            {"status": 200, "data": serializer.data}, status=status.HTTP_200_OK
        )
    except Event.DoesNotExist:
        return JsonResponse(
            {
                "status": 404,
                "error": "Not found",
                "error description": f"The event_id `{event_id}` you entered does not exist.",
            },
            status=status.HTTP_404_NOT_FOUND,
        )
    except ValidationError:
        return JsonResponse(
            {
                "status": 400,
                "error": "Invalid data",
                "error description": f"You have provided invalid data. Please try again.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET", "POST"])
def get_all_or_create_respondent_by_event():
    """
    View to get an event by event_id
    """
    pass


@api_view(["GET"])
def get_respondent_by_event():
    pass
