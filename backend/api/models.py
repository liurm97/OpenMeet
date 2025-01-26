"""
Database models
"""

from django.db import models
from uuid import uuid4


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

    1. if start_time_utc < end_time_utc -> difference in hours between the two
        eg: 9am - 11am -> 9am, 10am, 11am

    2. if start_time_utc = end_time_utc -> take 24 hours span
        eg: 9am - 9am -> 9am, 10am, 11am, 12am, 1pm, 2pm, 3pm, 4pm, ....., 8am, 9am

    3. if start_time_utc > end_time_utc -> difference in hours between the two
        eg: 11am - 9am -> 11am, 12pm, 1pm, 2pm, ...., 8am, 9am

    """
    id = models.CharField(
        primary_key=True, db_index=True, default=uuid4(), blank=False, null=False
    )

    # new event defaults to no owner or user id of a signed-in user
    owner = models.CharField(default="-1", blank=False, null=False)

    name = models.CharField(max_length=200, null=False, blank=False)

    type = models.IntegerField(
        choices=EventType.choices, default=1, blank=False, null=False
    )

    start_time_utc = models.CharField(max_length=200, null=False, blank=False)
    end_time_utc = models.CharField(max_length=200, null=False, blank=False)
    created_at_utc = models.DateTimeField(auto_now_add=True)
    updated_at_utc = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Event id: {self.id} | Event name: {self.name}"


class Date(models.Model):
    """
    Date table - stores specific dates associated to an event.

    @id: auto generated

    @date: from input form (if any)

    @event: id of event
    """

    id = models.CharField(primary_key=True, db_index=True, default=uuid4())
    date = models.DateField(max_length=100, blank=True, null=True)
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="eventDates"
    )

    def __str__(self):
        return f"Date: {self.date} | Linked to event {self.event.id}"


class Day(models.Model):
    """
    Day table - stores day of week associated to an event.

    @id: auto generated

    @day: from input form (if any)

    @event: id of event
    """

    id = models.CharField(primary_key=True, db_index=True, default=uuid4())
    day = models.DateField(max_length=100, blank=True, null=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="eventDays")

    def __str__(self):
        return f"Day: {self.day} | Linked to event {self.event.id}"

    class Meta:
        """
        Constraint: validate that `day` value is a valid day of week.
        """

        models.CheckConstraint(
            check=models.Q(day="Monday")
            | models.Q(day="Tuesday")
            | models.Q(day="Wednesday")
            | models.Q(day="Thursday")
            | models.Q(day="Friday")
            | models.Q(day="Saturday")
            | models.Q(day="Sunday"),
            name="day-of-week constraint",
            violation_error_message="Day must be a valid day of week",
        ),


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

    id = models.CharField(primary_key=True, db_index=True, default=uuid4())

    name = models.CharField(max_length=100, null=False, blank=False)

    # new respondent added to an event is by default guest user
    isGuestRespondent = models.BooleanField(null=False, blank=False, default=True)

    respondentEvent = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="respondentEvent"
    )

    def __str__(self):
        return f"Respondenet name: {self.name}"


class Availability(models.Model):
    """
    Availability table

    @id: auto generated

    @time: timestamp of selected availability timeslot

    @respondent: respondent details
    """

    id = models.CharField(primary_key=True, db_index=True, default=uuid4())
    time = models.CharField(null=False, blank=False)
    respondentAvailability = models.ForeignKey(
        Respondent, on_delete=models.CASCADE, related_name="respondentAvailability"
    )

    def __str__(self):
        return f"Respondent name: {self.respondent.name} | time: {self.time}"
