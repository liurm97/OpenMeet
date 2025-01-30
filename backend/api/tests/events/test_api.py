"""
Test Events APIs
"""

from django.test import TestCase, SimpleTestCase
from rest_framework.test import RequestsClient, APITestCase
from rest_framework import status
from uuid import uuid4

# from django.core.management import call_command
# from ...scripts.seed_db_script import seed_students_and_responses_db, seed_resources_db


class EventsAPITests(APITestCase):
    """
    Test for Events API endpoints
    """

    BASE_URL = "http://127.0.0.1:8000/api/v1/events"

    def test_create_event_resource_success_with_owner_returns_201(self):
        """
        Test successful create event resource with owner field value returns 201 OK
        Test Pass criteria:
            - Make a POST /api/v1/events and provide owner field value
            - Pass if response status code = 201
        """

        owner_value = str(uuid4())
        valid_request_payload = {
            "owner": owner_value,
            "name": "valid with owner 2",
            "type": 1,
            "start_time_utc": "09:00",
            "end_time_utc": "11:00",
        }

        response = self.client.post(self.BASE_URL, valid_request_payload, format="json")

        self.assertEqual(response.status_code, 201)

    def test_create_event_resource_success_without_owner_returns_201(self):
        """
        Test successful create event resource with owner field value returns 201 OK
        Test Pass criteria:
            - Make a POST /api/v1/events and does not provide owner field value
            - Pass if response status code = 201
        """
        valid_request_payload = {
            "name": "valid without owner",
            "type": 1,
            "start_time_utc": "09:00",
            "end_time_utc": "11:00",
        }

        response = self.client.post(self.BASE_URL, valid_request_payload, format="json")

        self.assertEqual(response.status_code, 201)

    def test_create_event_resource_fail_due_to_invalid_time_value_returns_400(self):
        """
        Test create event resource with invalid start_time_utc/end_time_utc value returns 400 NOT OK
        Test Pass criteria:
            - Make a POST /api/v1/events and provide invalid start_time_utc/end_time_utc
            - Pass if response status code = 400
        """

        invalid_time_request_payload = [
            {
                "start_time_utc": "09:01",
                "end_time_utc": "11:00",
            },
            {
                "start_time_utc": "09:0",
                "end_time_utc": "11:00",
            },
            {
                "start_time_utc": "9:00",
                "end_time_utc": "11:00",
            },
            {
                "start_time_utc": "09:00",
                "end_time_utc": "1:00",
            },
            {
                "start_time_utc": "09:00",
                "end_time_utc": "1:01",
            },
            {
                "start_time_utc": "09:00",
                "end_time_utc": "11:01",
            },
        ]

        request_unsuccessful_counter = 0

        for invalid_request in invalid_time_request_payload:
            request_payload = {
                **invalid_request,
                **{
                    "name": "valid without owner",
                    "type": 1,
                },
            }
            response_status_code = self.client.post(
                self.BASE_URL, request_payload, format="json"
            ).status_code

            if response_status_code == 400:
                request_unsuccessful_counter += 1

        self.assertEqual(
            request_unsuccessful_counter, len(invalid_time_request_payload)
        )

    def test_create_event_resource_fail_due_to_invalid_type_value_returns_400(self):
        """
        Test create event resource with invalid type type value should fail and return 400
        Test pass criteria:
            - Make a POST /api/v1/events and provide type value = 3
            - Pass if response status code = 400
        """
        invalid_request_payload = {
            "name": "valid without owner",
            "type": 3,
            "start_time_utc": "09:00",
            "end_time_utc": "11:00",
        }

        response = self.client.post(
            self.BASE_URL, invalid_request_payload, format="json"
        )

        self.assertEqual(response.status_code, 400)
