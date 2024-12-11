"""
Database models
"""

from django.db import models
from uuid import uuid4


class Event(models.Model):
    """
    Event table
    - One Event has many Respondents
    - One Event has many Dates
    """

    class EventType(models.IntegerChoices):
        SPECIFIC_DATES = 1, "Specific dates"
        DAYS_OF_THE_WEEK = 2, "Days of the week"

    id = models.UUIDField(primary_key=True, db_index=True)
    owner = models.UUIDField(default=uuid4())
    name = models.CharField(max_length=200, null=False, blank=False)
    type = models.IntegerField(choices=EventType.choices, default=2)
    startTime = models.CharField(max_length=200, null=False, blank=False)
    endTime = models.CharField(max_length=200, null=False, blank=False)

    def __str__(self):
        return self.name


class Respondent(models.Model):
    """
    Respondent table
    - One Respondent has many Availabilities
    """

    id = models.UUIDField(primary_key=True, db_index=True)
    name = models.CharField(max_length=100, null=False, blank=False)
    isGuestUser = models.BooleanField(null=False, blank=False)
    participatedEvent = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="participatedEvent"
    )

    def __str__(self):
        return self.name


class Date(models.Model):
    """
    Date table
    """

    id = models.UUIDField(primary_key=True, db_index=True)
    date = models.DateField(default="")
    dayOfWeek = models.CharField(max_length=100, default="")
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="event")

    def __str__(self):
        return f"dateId: {self.id}"


class Availability(models.Model):
    """
    Availability table
    """

    id = models.UUIDField(primary_key=True, db_index=True)
    time = models.DateTimeField()
    respondent = models.ForeignKey(
        Respondent, on_delete=models.CASCADE, related_name="respondent"
    )

    def __str__(self):
        return f"userId: {self.id} | time: {self.time}"
