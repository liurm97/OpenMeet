"""
Serializer for API
"""

from rest_framework import serializers
from .models import Event, Availability, Date, Respondent
from datetime import datetime
from uuid import uuid4


class RespondentSerializer(serializers.ModelSerializer):
    """
    Serializer for Respondent model
    """

    class Meta:
        model = Respondent
        fields = ["id", "name", "isGuest"]


class DateSerializer(serializers.ModelSerializer):
    """
    Serializer for Date model
    """

    class Meta:
        model = Date
        fields = ["date", "dayOfWeek"]


class ListEventSerializer(serializers.ModelSerializer):
    """
    Serializer for one event by event_id
    """

    eventDates = DateSerializer(many=True, read_only=True)
    # eventRespondent = RespondentSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = (
            "id",
            "owner",
            "name",
            "type",
            "startTime",
            "endTime",
            "eventDates",
            # "eventRespondent",
        )


class ListAllEventSerializer(serializers.ModelSerializer):
    """
    Serializer for All events
    """

    eventDates = DateSerializer(many=True)
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Event
        fields = ("id", "owner", "name", "type", "startTime", "endTime", "eventDates")

    def validate_startTime(self, data):
        """
        validate that startTime minute must end with '00'. Eg: 09:00
        validate that startTime hour must be between 01 - 23. Eg: 00:00 <-> 23:00
        """
        startTime = data
        hour = datetime.strftime(datetime.strptime(startTime, "%H:%M:%S"), "%H")
        minute = datetime.strftime(datetime.strptime(startTime, "%H:%M:%S"), "%M")
        if minute != "00":
            raise serializers.ValidationError("startTime must end with '00'. Eg: 09:00")
        elif int(hour) < 0 or int(hour) > 23:
            raise serializers.ValidationError(
                "startTime must be between '01' & '23'. Eg: 09:00"
            )
        else:
            return data

    def validate_endTime(self, data):
        validate_endTime = data
        minute = datetime.strftime(
            datetime.strptime(validate_endTime, "%H:%M:%S"), "%M"
        )
        if minute != "00":
            raise serializers.ValidationError("endTime must end with '00'. Eg: 09:00")
        else:
            return data

    def create(self, validated_data):
        event_id = uuid4()
        event_type = validated_data.get("type")

        # get eventDate array & remove it from request payload
        dates_data = validated_data.pop("eventDates")

        event_data = {"id": event_id, **validated_data}
        # Insert into Event table -> returns Event object
        event_obj = Event.objects.create(**event_data)

        if event_type == 1:
            # for every date in eventDate array, insert into Date table
            for date in dates_data:
                Date.objects.create(date=date["date"], event=event_obj, id=uuid4())

        elif event_type == 2:
            for date in dates_data:
                Date.objects.create(
                    dayOfWeek=date["dayOfWeek"], event=event_obj, id=uuid4()
                )

        return event_obj
