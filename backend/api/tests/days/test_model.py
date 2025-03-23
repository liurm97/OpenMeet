"""
Test Day data model
"""

from django.test import TestCase
from ...models import Event, Day, Date, Respondent, Availability
from django.db.utils import IntegrityError
from uuid import uuid4
from django.core.exceptions import ValidationError
from django.db.transaction import TransactionManagementError


class DayModelTests(TestCase):
    """
    Test for Day model
    """

    unique_id_str = str(uuid4())
    valid_create_event_payload = {
        "id": unique_id_str,
        "owner": "-1",
        "name": "valid event name",
        "type": 2,
        "start_time_utc": "09:00",
        "end_time_utc": "10:00",
    }

    def test_create_day_resource_should_succeed(self):
        """
        Test insert day record with valid values should succeed
        Test Pass criteria:
            - After successfully create one day resource
            - Get all day records
            - The length of all returned day records should = 1
        """
        # create related event resource
        unique_id_str = str(uuid4())

        self.valid_create_event_payload["id"] = unique_id_str
        created_event = Event.objects.create(**self.valid_create_event_payload)

        # define create day payload
        create_day_payload = {
            "day": "Monday",
        }

        # add event resource to day payload
        create_day_payload["event"] = created_event
        Day.objects.create(**create_day_payload)
        num_event_records = len(Day.objects.all())
        self.assertEqual(num_event_records, 1)

    def test_create_day_resource_invalid_day_value_should_fail(self):
        """
        Test insert day record with invalid day value should fail
        Test Pass criteria:
            - Test 21 common invalid day values
            - Creating new day resource raises ValidationError
        """

        invalid_days = [
            {
                "day": "monday",
            },
            {
                "day": "mon",
            },
            {
                "day": "Mon",
            },
            {
                "day": "tuesday",
            },
            {
                "day": "tues",
            },
            {
                "day": "Tues",
            },
            {
                "day": "wednesday",
            },
            {
                "day": "wed",
            },
            {
                "day": "Wed",
            },
            {
                "day": "thursday",
            },
            {
                "day": "thur",
            },
            {
                "day": "Thur",
            },
            {
                "day": "friday",
            },
            {
                "day": "fri",
            },
            {
                "day": "Fri",
            },
            {
                "day": "saturday",
            },
            {
                "day": "sat",
            },
            {
                "day": "Sat",
            },
            {
                "day": "sunday",
            },
            {
                "day": "sun",
            },
            {
                "day": "Sun",
            },
        ]
        validation_error_counter = 0
        for day in invalid_days:
            try:
                unique_id_str = str(uuid4())
                self.valid_create_event_payload["id"] = unique_id_str
                created_event = Event.objects.create(**self.valid_create_event_payload)

                day["event"] = created_event
                day["id"] = str(uuid4())
                Day.objects.create(**day)

            except IntegrityError as err:
                validation_error_counter += 1

            except TransactionManagementError as err:
                validation_error_counter += 1

        self.assertEqual(validation_error_counter, len(invalid_days))
