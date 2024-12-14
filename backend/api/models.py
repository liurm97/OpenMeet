"""
Database models
"""

from django.db import models
from uuid import uuid4
from datetime import datetime


class Event(models.Model):
    class EventType(models.IntegerChoices):
        SPECIFIC_DATES = 1, "Specific dates"
        DAYS_OF_THE_WEEK = 2, "Days of the week"

    """
    Event table
    - One Event has many Respondents
    - One Event has many Dates

    @id: auto generated

    @owner:
        - if no owner: -1 (default)
        - else: id of signed_in respondent

    @name: from input form

    @type: from input form

    @startTime: from input form

    @endTime: from input form
    """
    id = models.CharField(primary_key=True, db_index=True)
    owner = models.CharField(default="-1")
    name = models.CharField(max_length=200, null=False, blank=False)
    type = models.IntegerField(choices=EventType.choices, default=2)
    startTime = models.CharField(max_length=200, null=False, blank=False)
    endTime = models.CharField(max_length=200, null=False, blank=False)

    @property
    def isValidTime(self):
        print("start")
        print(self.startTime, self.endTime)
        format_startTime = datetime.strptime(
            f"{datetime.now().strftime('%Y-%m-%d')} {self.startTime}",
            f"%Y-%m-%d %H:%M:%S",
        )
        format_endTime = datetime.strptime(
            f"{datetime.now().strftime('%Y-%m-%d')} {self.endTime}",
            f"%Y-%m-%d %H:%M:%S",
        )
        print("end")
        print(format_startTime, format_endTime)
        return format_endTime > format_startTime

    def __str__(self):
        return self.name


class Respondent(models.Model):
    """
    Respondent table
    - One Respondent has many Availabilities

    @id: auto generated

    @name: from availability timelsot grid

    @isGuestUser:
        - True if respondent is signed_in
        - False otherwise

    @participatedEvent: id of event
    """

    id = models.UUIDField(primary_key=True, db_index=True)
    name = models.CharField(max_length=100, null=False, blank=False)
    isGuest = models.BooleanField(null=False, blank=False)
    eventRespondent = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="eventRespondent"
    )

    def __str__(self):
        return self.name


class Date(models.Model):
    """
    Date table

    @id: auto generated

    @date: from input form (if any)

    @dayOfWeek: from input form (if any)

    @event: id of event
    """

    id = models.UUIDField(primary_key=True, db_index=True)
    date = models.CharField(max_length=100, default="", blank=True, null=True)
    dayOfWeek = models.CharField(max_length=100, default="", blank=True, null=True)
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="eventDates"
    )

    def __str__(self):
        return f"dateId: {self.id}"


class Availability(models.Model):
    """
    Availability table

    @id: auto generated

    @time: timestamp of selected availability timeslot

    @respondenete: id of respondent
    """

    id = models.UUIDField(primary_key=True, db_index=True)
    time = models.DateTimeField()
    respondent = models.ForeignKey(
        Respondent, on_delete=models.CASCADE, related_name="respondent"
    )

    def __str__(self):
        return f"userId: {self.id} | time: {self.time}"
