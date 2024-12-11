from rest_framework import serializers
from .models import Event, Availability, Date, Respondent


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ("id", "owner", "name", "type", "startTime", "endTime")

    def validate_id(self, value):
        """
        value: id that is being validated
        """
        pass
