from rest_framework import serializers
from ..models import Availability
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
    Serializer for POST /events/<event_id>/availabilities to verify that required fields are in the payload.
    """

    event_id = serializers.UUIDField(required=True)
    respondentName = serializers.CharField(required=True)
    respondentArray = EventTimeUTCSerializer(many=True, required=True)
    isGuestRespondent = serializers.BooleanField(required=True)
    signedInUserId = serializers.CharField(required=False)

    class Meta:
        fields = [
            "event_id",
            "respondentName",
            "respondentArray",
            "isGuestRespondent",
            "signedInUserId",
        ]


class DeleteSpecificEventAvailabilitySerializer(serializers.Serializer):
    """
    Serializer for DELETE /events/<event_id>/availabilities to verify that required fields are in the payload.
    """

    event_id = serializers.UUIDField(required=True)
    respondentId = serializers.CharField(required=True)

    class Meta:
        fields = [
            "event_id",
            "respondentId",
        ]
