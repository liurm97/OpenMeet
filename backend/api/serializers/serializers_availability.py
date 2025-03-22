from rest_framework import serializers
from ..models import Event, Availability, Date, Day, Respondent
from datetime import datetime
from uuid import uuid4
from django.core.validators import RegexValidator


class AvailabilitySerializer(serializers.ModelSerializer):
    """
    Serializer for Availability model
    """

    time = serializers.CharField(
        required=True,
        validators=[
            RegexValidator(
                regex=r"^(?!\s*$).+",
                message="name cannot be empty",
            ),
        ],
    )

    class Meta:
        model = Availability
        fields = ["time"]


class EventTimeUTCSerializer(serializers.Serializer):
    time_utc = serializers.CharField(required=True)


class AddSpecificEventAvailabilitySerializer(serializers.Serializer):
    """
    Serializer for POST /events/<event_id>/availabilities to verify that `event_id` is provided in parameter.
    """

    event_id = serializers.UUIDField(required=True)
    respondentName = serializers.CharField(required=True)
    respondentArray = EventTimeUTCSerializer(many=True, required=True)
    isGuestRespondent = serializers.BooleanField(required=True)

    class Meta:
        fields = ["event_id", "respondentName", "respondentArray", "isGuestRespondent"]
