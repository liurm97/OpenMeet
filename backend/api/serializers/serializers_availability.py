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
