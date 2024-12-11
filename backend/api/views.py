from django.shortcuts import render
from .models import Event
from .serializers import EventSerializer
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework import status
from rest_framework import generics, viewsets

"""
Events
"""


@api_view(["GET", "POST"])
def get_all_events(request):
    if request.method == "GET":
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return JsonResponse({"data": serializer.data}, status=200)
    else:
        return JsonResponse({"data": "POST"}, status=200)


id = "1f1c365d-a928-44a2-9d95-b14d37f79e60"


@api_view(["GET"])
def get_event_by_pk(request, pk: str):
    event = Event.objects.get(pk=pk)
    serializer = EventSerializer(event)
    return JsonResponse({"data": serializer.data}, status=200)


# class EventListView(generics.ListAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer
