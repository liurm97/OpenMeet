"""
Test Respondent data model
"""

from django.test import TestCase
from ...models import Event, Day, Date, Respondent, Availability
from django.db.utils import IntegrityError
from uuid import uuid4
from django.core.exceptions import ValidationError
from django.db.transaction import TransactionManagementError


class RespondentModelTests(TestCase):
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

    def test_create_respondent_resource_should_succeed(self):
        """
        Test insert respondent record with valid values should succeed
        Test Pass criteria:
            - After successfully create one respondent resource
            - Get all respondent records
            - The length of all returned respondent records should = 1
        """
        # create related event resource
        created_event = Event.objects.create(**self.valid_create_event_payload)

        # define created date payload
        create_respondent_payload = {"name": "Max", "isGuestRespondent": True}

        # add event resource to date payload
        create_respondent_payload["respondentEvent"] = created_event
        Respondent.objects.create(**create_respondent_payload)
        num_event_records = len(Respondent.objects.all())
        self.assertEqual(num_event_records, 1)

    def test_create_respondent_resource_invalid_name_value_should_fail(self):
        """
        Test insert respondent record with invalid name value should fail
        Test Pass criteria:
            - Test name = empty string, blank-only strings
            - Creating new respondent resource raises ValidationError
        """
        invalid_names = [
            {"name": "", "isGuestRespondent": True},
            {"name": " ", "isGuestRespondent": True},
            {"name": "   ", "isGuestRespondent": True},
        ]
        validation_error_counter = 0
        for name in invalid_names:
            try:
                unique_id_str_event = str(uuid4())
                self.valid_create_event_payload["id"] = unique_id_str_event
                created_event = Event.objects.create(**self.valid_create_event_payload)
                create_respondent_payload = name

                unique_id_str_respondent = str(uuid4())
                create_respondent_payload["id"] = unique_id_str_respondent
                create_respondent_payload["respondentEvent"] = created_event
                created_respondent = Respondent.objects.create(
                    **create_respondent_payload
                )

                if created_respondent.full_clean():
                    created_respondent.save()

            except ValidationError as err:
                validation_error_counter += 1

        self.assertEqual(validation_error_counter, len(invalid_names))
