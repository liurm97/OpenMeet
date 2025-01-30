from rest_framework import serializers
from ..models import Event, Availability, Date, Day, Respondent
from datetime import datetime
from uuid import uuid4
from django.core.validators import RegexValidator


class DateSerializer(serializers.ModelSerializer):
    """
    Serializer for Date model
    """

    date = serializers.CharField(
        required=True,
        validators=[
            RegexValidator(
                regex=r"^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$",
                message="Invalid date format. Must be YYYY-mm-dd",
            )
        ],
    )

    class Meta:
        model = Date
        fields = [
            "date",
        ]

    def create(self, validated_data):
        date_unique_id = str(uuid4())
        date = validated_data["date"]
        parent_created_event = self.context["created_event"]
        Date.objects.create(id=date_unique_id, date=date, event=parent_created_event)
