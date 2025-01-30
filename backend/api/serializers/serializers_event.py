"""
Serializer for Event API
"""

from django.forms import CharField
from rest_framework import serializers
from ..models import Event, Availability, Date, Day, Respondent
from datetime import datetime
from uuid import uuid4
from django.core.validators import RegexValidator
from copy import deepcopy


class DaySerializer(serializers.Serializer):
    day = serializers.CharField()


class DateSerializer(serializers.Serializer):
    date = serializers.CharField()


class CreateEventRequestBodySerializer(serializers.Serializer):
    """
    Serializer for Create Event to validate acceptable request body fields are passed in
    """

    name = serializers.CharField()
    owner = serializers.CharField(required=False)
    type = serializers.IntegerField()
    start_time_utc = serializers.CharField(
        validators=[
            RegexValidator(
                regex="(0[0-9]{1}|1[0-9]{1}|2[0-3]{1}):00$",
                message="Please format in hh:mm. It should end with '00'",
            ),
        ],
    )
    end_time_utc = serializers.CharField(
        validators=[
            RegexValidator(
                regex="(0[0-9]{1}|1[0-9]{1}|2[0-3]{1}):00$",
                message="Please format in hh:mm. It should end with '00'",
            ),
        ],
    )
    eventDates = DateSerializer(many=True, required=False)
    eventDays = DaySerializer(many=True, required=False)

    class Meta:
        fields = [
            "name",
            "owner",
            "type",
            "start_time_utc",
            "end_time_utc",
            "eventDates",
            "eventDays",
        ]

    def validate(self, data):
        valid_field_one = CreateEventRequestBodySerializer.Meta.fields.copy()
        valid_field_one.remove("eventDates")

        valid_field_two = CreateEventRequestBodySerializer.Meta.fields.copy()
        valid_field_two.remove("eventDays")

        if (
            list(data.keys()) != valid_field_one
            and list(data.keys()) != valid_field_two
        ):
            raise serializers.ValidationError("Request payload contains invalid field.")

        return data


class CreateEventSerializer(serializers.ModelSerializer):
    """
    Serializer for Create Event based on Event model
    """

    id = serializers.CharField(read_only=True)
    name = serializers.CharField(required=True)
    type = serializers.IntegerField(required=True)
    start_time_utc = serializers.CharField(
        required=True,
        validators=[
            RegexValidator(
                regex="(0[0-9]{1}|1[0-9]{1}|2[0-3]{1}):00$",
                message="Please format in hh:mm. It should end with '00'",
            ),
        ],
    )
    end_time_utc = serializers.CharField(
        required=True,
        validators=[
            RegexValidator(
                regex="(0[0-9]{1}|1[0-9]{1}|2[0-3]{1}):00$",
                message="Please format in hh:mm. It should end with '00'",
            ),
        ],
    )

    class Meta:
        model = Event
        fields = [
            "id",
            "owner",
            "name",
            "type",
            "start_time_utc",
            "end_time_utc",
        ]

    def validate_type(self, data):
        """
        Validate that type value must be either 1 or 2
        """
        if data == 1 or data == 2:
            return data
        else:
            raise serializers.ValidationError("Accepts either 1 or 2")

    def create(self, validated_data):
        """
        If request payload is validated, create Event resource
        """
        print(f"CreateEventSerializer:: validated_data:: {validated_data}")
        # if owner is passed in:
        if "owner" in validated_data.keys():
            owner = validated_data["owner"]
        else:
            owner = "-1"

        unique_id_str = str(uuid4())
        name = validated_data["name"]
        type = validated_data["type"]
        start_time_utc = validated_data["start_time_utc"]
        end_time_utc = validated_data["end_time_utc"]
        event_obj = Event(
            id=unique_id_str,
            owner=owner,
            name=name,
            type=type,
            start_time_utc=start_time_utc,
            end_time_utc=end_time_utc,
        )
        event_obj.save()
        return event_obj


class GetSpecificEventSerializer(serializers.Serializer):
    pass


# class ListAllEventSerializer(serializers.ModelSerializer):
#     """
#     Serializer for All events
#     """

#     eventDates = DateSerializer(many=True)
#     id = serializers.CharField(read_only=True)

#     class Meta:
#         model = Event
#         fields = ("id", "owner", "name", "type", "startTime", "endTime", "eventDates")

#     def validate_startTime(self, data):
#         """
#         validate that startTime minute must end with '00'. Eg: 09:00
#         validate that startTime hour must be between 01 - 23. Eg: 00:00 <-> 23:00
#         """
#         startTime = data
#         hour = datetime.strftime(datetime.strptime(startTime, "%H:%M:%S"), "%H")
#         minute = datetime.strftime(datetime.strptime(startTime, "%H:%M:%S"), "%M")
#         if minute != "00":
#             raise serializers.ValidationError("startTime must end with '00'. Eg: 09:00")
#         elif int(hour) < 0 or int(hour) > 23:
#             raise serializers.ValidationError(
#                 "startTime must be between '01' & '23'. Eg: 09:00"
#             )
#         else:
#             return data

#     def validate_endTime(self, data):
#         validate_endTime = data
#         minute = datetime.strftime(
#             datetime.strptime(validate_endTime, "%H:%M:%S"), "%M"
#         )
#         if minute != "00":
#             raise serializers.ValidationError("endTime must end with '00'. Eg: 09:00")
#         else:
#             return data

#     def create(self, validated_data):
#         event_id = uuid4()
#         event_type = validated_data.get("type")

#         # get eventDate array & remove it from request payload
#         dates_data = validated_data.pop("eventDates")

#         event_data = {"id": event_id, **validated_data}
#         # Insert into Event table -> returns Event object
#         event_obj = Event.objects.create(**event_data)

#         if event_type == 1:
#             # for every date in eventDate array, insert into Date table
#             for date in dates_data:
#                 Date.objects.create(date=date["date"], event=event_obj, id=uuid4())

#         elif event_type == 2:
#             for date in dates_data:
#                 Date.objects.create(
#                     dayOfWeek=date["dayOfWeek"], event=event_obj, id=uuid4()
#                 )

#         return event_obj
