"""
Test Event data model
"""

from django.test import TestCase
from ...models import Event, Day, Date, Respondent, Availability
from django.db.utils import IntegrityError
from uuid import uuid4
from django.core.exceptions import ValidationError


class EventModelTests(TestCase):
    """
    Test for Event model
    """

    valid_create_event_payload = {
        "owner": "-1",
        "name": "valid event name",
        "type": 1,
        "start_time_utc": "09:00",
        "end_time_utc": "10:00",
    }

    def test_create_event_resource_should_succeed(self):
        """
        Test insert event record with valid values should succeed
        Test Pass criteria:
            - After successfully create one event resource
            - Get all event records
            - The length of all returned event records should = 1
        """
        Event.objects.create(**self.valid_create_event_payload)
        num_event_records = len(Event.objects.all())
        self.assertEqual(num_event_records, 1)

    def test_create_event_resource_valid_uuid_owner_should_succeed(self):
        """
        Test insert event record with valid uuid owner id should succeed
        Test Pass criteria:
            - After successfully create one event resource
            - Get all event records
            - The length of all returned event records should = 1
        """
        random_uuid_str = str(uuid4())
        valid_owner_uuid_create_event_payload = self.valid_create_event_payload.copy()
        valid_owner_uuid_create_event_payload["owner"] = random_uuid_str
        Event.objects.create(**self.valid_create_event_payload)
        num_event_records = len(Event.objects.all())
        self.assertEqual(num_event_records, 1)

    def test_create_event_resource_invalid_type_value_should_fail(self):
        """
        Test insert event record with invalid valid type value should fail
        Test pass criteria:
            - Event type = 3
            - Creating new event resource raises IntegrityError
        """
        invalid_type_create_event_payload = self.valid_create_event_payload.copy()
        invalid_type_create_event_payload["type"] = 3
        with self.assertRaises(IntegrityError):
            Event.objects.create(**invalid_type_create_event_payload)

    def test_create_event_resource_invalid_start_time_utc_should_fail(self):
        """
        Test insert event record with invalid valid end_time_utc value should fail
        Test Pass criteria:
            - Event invalid start_time_utc = 9:30
            - Creating new event resource raises ValidationError
        """
        invalid_type_create_event_payload = self.valid_create_event_payload.copy()
        invalid_type_create_event_payload["start_time_utc"] = "9:30"
        created_event = Event.objects.create(**invalid_type_create_event_payload)
        with self.assertRaises(ValidationError):
            # Forces model level validation
            if created_event.full_clean():
                created_event.save()

    def test_create_event_resource_invalid_end_time_utc_should_fail(self):
        """
        Test insert event record with invalid valid end_time_utc value should fail
        Test Pass criteria:
            - Event invalid end_time_utc = 24:30
            - Creating new event resource raises ValidationError
        """
        invalid_type_create_event_payload = self.valid_create_event_payload.copy()
        invalid_type_create_event_payload["end_time_utc"] = "24:30"
        created_event = Event.objects.create(**invalid_type_create_event_payload)
        with self.assertRaises(ValidationError):
            # Forces model level validation
            if created_event.full_clean():
                created_event.save()
