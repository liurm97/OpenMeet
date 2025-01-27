"""
Views for Events
"""

# models and serializers
from ..models import Event, Date, Day, Respondent, Availability
from ..serializers import ListAllEventSerializer, ListEventSerializer

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

    def validate_postResourcesValidParams(self, data: dict):
        """
        Validate that accepted optional parameter.
        Fail if any thing other than 'type', 'url', 'csrfmiddlewaretoken'  is used.
        """
        ACCEPTABLE_PARAMS = ["type", "url", "csrfmiddlewaretoken"]
        provided_param_keys: list[str] = list(data.keys())
        unacceptable_params = []

        for provided_param_key in provided_param_keys:
            if provided_param_key not in ACCEPTABLE_PARAMS:
                unacceptable_params.append(provided_param_key)

        if len(unacceptable_params) > 0:
            return unacceptable_params, False, "Invalid Params"

        return None, True, None

    def post(self, request, format=None):
        unaccepted_params, isValidParams, resourceValidParamsReason = (
            self.validate_postResourcesValidParams(request.data)
        )

        if not isValidParams:
            return JsonResponse(
                {
                    "message": f"You have passed in invalid field: ({', '.join(unaccepted_params)})",
                    "reason": resourceValidParamsReason,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = CreateResourceRequestBodySerializer(data=request.data)

        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response(
                    "Something wrong happened. Please try again.",
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )


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
