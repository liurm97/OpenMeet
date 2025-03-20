"""
Database models
"""

from django.db import models
from uuid import uuid4
from django.core.validators import RegexValidator
from django.core.validators import MinLengthValidator


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

    @agenda: after event is created, user

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

    type = models.IntegerField(choices=EventType.choices, blank=False, null=False)

    agenda = models.TextField(default="", blank=True, null=True)

    start_time_utc = models.CharField(
        default="09:00",
        max_length=200,
        null=False,
        blank=False,
        validators=[
            RegexValidator(
                regex="(0[0-9]{1}|1[0-9]{1}|2[0-3]{1}):00$",
                message="Please format in hh:mm. It should end with '00'",
            ),
        ],
    )
    end_time_utc = models.CharField(
        default="10:00",
        max_length=200,
        null=False,
        blank=False,
        validators=[
            RegexValidator(
                regex="(0[0-9]{1}|1[0-9]{1}|2[0-3]{1}):00$",
                message="Please format in hh:mm. It should end with '00'",
            ),
        ],
    )

    created_at_utc = models.DateTimeField(auto_now_add=True)
    updated_at_utc = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Event id: {self.id} | Event name: {self.name}"

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(type=1) | models.Q(type=2),
                name="Type constraint",
                violation_error_message="Integer type must be either 1 or 2.",
            )
        ]


class Date(models.Model):
    """
    Date table - stores specific dates associated to an event.

    @id: auto generated

    @date: from input form (if any)

    @event: id of event
    """

    id = models.CharField(primary_key=True, db_index=True, default=uuid4())
    date = models.DateField(
        max_length=100,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r"^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$",
                message="Invalid date format. Must be YYYY-mm-dd",
            )
        ],
    )
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
    day = models.CharField(max_length=100, blank=True, null=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="eventDays")

    def __str__(self):
        return f"Day: {self.day} | Linked to event {self.event.id}"

    class Meta:
        """
        Constraint: validate that `day` value is a valid day of week.
        """

        constraints = [
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
            )
        ]


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

    name = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        validators=[
            MinLengthValidator(1),
            RegexValidator(regex=r"^(?!\s*$).+", message="name cannot be empty."),
        ],
    )

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
    Accepts:
    - yyyy/mm/dd hh:00 or hh:30
    - Monday hh:00 or hh:30
    - Tuesday hh:00 or hh:30
    - Wednesday hh:00 or hh:30
    - Thursday hh:00 or hh:30
    - Friday hh:00 or hh:30
    - Saturday hh:00 or hh:30
    - Sunday hh:00 or hh:30


    @respondent: respondent details
    """

    id = models.CharField(primary_key=True, db_index=True, default=uuid4())
    time_utc = models.CharField(
        null=False,
        blank=False,
        validators=[
            RegexValidator(
                regex=r"((Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)|^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01]))\s(0[0-9]{1}|1[0-9]{1}|2[0-3]{1}):00$|(0[0-9]{1}|1[0-9]{1}|2[0-3]{1}):30$",
                message="Valid availability time must be one of the following formats - [yyyy-mm-dd hh:00 or hh:30] or [day_of_week hh:00 or hh:30] ",
            )
        ],
    )
    respondentAvailability = models.ForeignKey(
        Respondent, on_delete=models.CASCADE, related_name="respondentAvailability"
    )

    def __str__(self):
        return (
            f"Respondent name: {self.respondentAvailability.name} | time: {self.time}"
        )
