"""
Test Date data model
"""

from django.test import TestCase
from ...models import Event, Day, Date, Respondent, Availability
from django.db.utils import IntegrityError
from uuid import uuid4
from django.core.exceptions import ValidationError
from django.db.transaction import TransactionManagementError


class DateModelTests(TestCase):
    """
    Test for Date model
    """

    valid_create_event_payload = {
        "owner": "-1",
        "name": "valid event name",
        "type": 1,
        "start_time_utc": "09:00",
        "end_time_utc": "10:00",
    }

    def test_create_date_resource_should_succeed(self):
        """
        Test insert date record with valid values should succeed
        Test Pass criteria:
            - After successfully create one date resource
            - Get all date records
            - The length of all returned date records should = 1
        """
        # create related event resource
        created_event = Event.objects.create(**self.valid_create_event_payload)

        # define created date payload
        create_date_payload = {
            "date": "2025-01-01",
        }

        # add event resource to date payload
        create_date_payload["event"] = created_event
        Date.objects.create(**create_date_payload)
        num_event_records = len(Date.objects.all())
        self.assertEqual(num_event_records, 1)

    def test_create_date_resource_invalid_date_value_should_fail(self):
        """
        Test insert date record with invalid date value should fail
        Test Pass criteria:
            - Test invalid date values
            - Creating new date resource raises ValidationError
        """

        invalid_dates = [
            {
                "date": "25-13-01",
            },
            {
                "date": "2025-13-01",
            },
            {
                "date": "2025-01-00",
            },
            {
                "date": "",
            },
        ]
        validation_error_counter = 0
        for date in invalid_dates:
            try:
                created_event = Event.objects.create(**self.valid_create_event_payload)
                create_date_payload = date
                create_date_payload["event"] = created_event
                Date.objects.create(**create_date_payload)

            except ValidationError as err:
                validation_error_counter += 1

            except TransactionManagementError as err:
                validation_error_counter += 1

        self.assertEqual(validation_error_counter, len(invalid_dates))
