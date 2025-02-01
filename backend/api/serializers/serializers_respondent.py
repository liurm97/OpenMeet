from rest_framework import serializers
from ..models import Event, Availability, Date, Day, Respondent
from datetime import datetime
from uuid import uuid4
from django.core.validators import RegexValidator


class RespondentSerializer(serializers.ModelSerializer):
    """
    Serializer for Respondent model
    """

    id = serializers.UUIDField(read_only=True)

    name = serializers.CharField(
        required=True,
        validators=[
            RegexValidator(
                regex=r"^(?!\s*$).+",
                message="name cannot be empty",
            ),
        ],
    )

    isGuestRespondent = serializers.BooleanField(read_only=True)

    class Meta:
        model = Respondent
        fields = ["id", "name", "isGuestRespondent"]
