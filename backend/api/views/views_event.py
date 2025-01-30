"""
Views for Events
"""

# models and serializers
from ..models import Event, Date, Day, Respondent, Availability
from ..serializers.serializers_event import CreateEventSerializer

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
        print(f"request.data:: {request.data}")
        serializer = CreateEventSerializer(data=request.data)

        if serializer.is_valid():
            print("valid")
            try:
                print("in try statement")
                serializer.save()
                print(f"after save serializer.data:: {serializer.data}")
                return Response(
                    serializer.validated_data, status=status.HTTP_201_CREATED
                )

            except Exception as e:
                return Response(
                    f"Something wrong happened. Please try again.\n{e}",
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            print("not valid")
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
