"""
Test event availabilities APIs
"""

from rest_framework.test import APITestCase
from django.core.management import call_command

from ...models import Event, Respondent


class EventsAPITests(APITestCase):
    """
    Test for event respondent availabilities API endpoints
    """

    BASE_URL = "http://127.0.0.1:8000/api/v1/events"

    def test_create_event_respondent_availability_resource_success_with_owner_returns_201(
        self,
    ):
        """
        Test successful create event respondent availability resource with owner field value returns 201 OK
        Test Pass criteria:
            - Make a POST /api/v1/events/:event_id/availabilities and provide valid payload
            - Pass if response status code = 201
        """

        call_command("seed_db_days")

        created_event_id = Event.objects.first().id
        valid_request_payload = [
            {
                "respondentName": "test",
                "respondentArray": [{"time_utc": "Wednesday 09:00"}],
                "isGuestRespondent": True,
            },
            {
                "respondentName": "test",
                "respondentArray": [{"time_utc": "Wednesday 09:00"}],
                "isGuestRespondent": False,
            },
            {
                "signedInUsedId": "user_112233445566",
                "respondentName": "test",
                "respondentArray": [{"time_utc": "Wednesday 09:00"}],
                "isGuestRespondent": False,
            },
        ]
        headers = {"Authorization": "1bc84a76-57f0-4678-82a0-9092c2edf8c5"}

        expected_responses = [201, 201, 201]
        actual_responses = []

        for payload in valid_request_payload:
            actual_responses.append(
                self.client.post(
                    f"{self.BASE_URL}/{created_event_id}/availabilities",
                    payload,
                    headers=headers,
                    format="json",
                ).status_code
            )

        self.assertEqual(expected_responses, actual_responses)

    def test_create_event_respondent_availability_resource_without_authorization_header_returns_401(
        self,
    ):
        """
        Test create event respondent availability resource without authorization header returns 401
        Test Pass criteria:
            - Make a POST /api/v1/events/:eventId/availabilities and without authorization header
            - Pass if response status code = 401
        """
        call_command("seed_db_days")

        created_event_id = Event.objects.first().id

        valid_request_payload = (
            {
                "respondentName": "test",
                "respondentArray": [{"time_utc": "Wednesday 09:00"}],
                "isGuestRespondent": False,
            },
        )

        response = self.client.post(
            f"{self.BASE_URL}/{created_event_id}/availabilities",
            valid_request_payload,
            format="json",
        )

        self.assertEqual(response.status_code, 401)
