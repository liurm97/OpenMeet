"""
Test Availability data model
"""

from django.test import TestCase
from ...models import Event, Day, Date, Respondent, Availability
from django.db.utils import IntegrityError
from uuid import uuid4
from django.core.exceptions import ValidationError
from django.db.transaction import TransactionManagementError


class AvailabilityModelTests(TestCase):
    """
    Test for Availability model
    """

    valid_create_event_payload = {
        "owner": "-1",
        "name": "valid event name",
        "type": 1,
        "start_time_utc": "09:00",
        "end_time_utc": "10:00",
    }

    valid_create_respondent_payload = {
        "name": "valid respondent name",
        "isGuestRespondent": True,
    }

    def test_create_availability_resource_should_succeed(self):
        """
        Test insert availability record with valid values should succeed
        Test Pass criteria:
            - After successfully create one availability record
            - Get all availability records
            - The length of all returned availability records should = 1
        """
        # create related event resource
        created_event = Event.objects.create(**self.valid_create_event_payload)

        # create relateed respondent resource
        created_respondent = Respondent.objects.create(
            **self.valid_create_respondent_payload, **{"respondentEvent": created_event}
        )
        valid_create_availability_payload = {
            "time": "09:00",
            "respondentAvailability": created_respondent,
        }

        Availability.objects.create(**valid_create_availability_payload)
        num_event_records = len(Respondent.objects.all())

        self.assertEqual(num_event_records, 1)

    def test_create_respondent_resource_invalid_name_value_should_fail(self):
        """
        Test insert respondent record with invalid time value should fail
        Test Pass criteria:
            - Test time = invalid times that follow neither of the following formats - hh:00 or hh:30
            - Creating new availability resource raises ValidationError
        """
        invalid_availability_times = [
            {"time": "09:01"},
            {"time": "09:11"},
            {"time": "9:01"},
            {"time": "09:001"},
        ]
        validation_error_counter = 0
        for time in invalid_availability_times:
            try:
                # prepare event data
                unique_id_str_event = str(uuid4())
                self.valid_create_event_payload["id"] = unique_id_str_event
                created_event = Event.objects.create(**self.valid_create_event_payload)

                # prepare respondent data
                unique_id_str_respondent = str(uuid4())
                self.valid_create_respondent_payload["id"] = unique_id_str_respondent
                self.valid_create_respondent_payload["respondentEvent"] = created_event
                created_respondent = Respondent.objects.create(
                    **self.valid_create_respondent_payload
                )

                # prepare availability data
                unique_id_str_availability = str(uuid4())
                time["respondentAvailability"] = created_respondent
                time["id"] = unique_id_str_availability
                created_availability = Availability.objects.create(**time)

                # force model level field validation
                if created_availability.full_clean():
                    created_availability.save()

            except ValidationError:
                validation_error_counter += 1

        self.assertEqual(validation_error_counter, len(invalid_availability_times))
