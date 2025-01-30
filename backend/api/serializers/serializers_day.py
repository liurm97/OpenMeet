from rest_framework import serializers
from ..models import Event, Availability, Date, Day, Respondent
from datetime import datetime
from uuid import uuid4
from django.core.validators import RegexValidator


class DaySerializer(serializers.ModelSerializer):
    """
    Serializer for Date model
    """

    day = serializers.CharField(
        required=True,
    )

    class Meta:
        model = Day
        fields = [
            "day",
        ]

    def validate_day(self, data):
        valid_day_values = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
        if data not in valid_day_values:
            raise serializers.ValidationError(
                f"Accepts one of the following [{valid_day_values}]"
            )
        return data

    def create(self, validated_data):
        day_unique_id = str(uuid4())
        day = validated_data["day"]
        parent_created_event = self.context["created_event"]
        Day.objects.create(id=day_unique_id, day=day, event=parent_created_event)
