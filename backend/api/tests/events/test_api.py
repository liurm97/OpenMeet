"""
Test events APIs
"""

from rest_framework.test import APITestCase
from django.core.management import call_command
from uuid import uuid4

from ...models import Event


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
        event_id = str(uuid4())
        valid_request_payload = {
            "id": event_id,
            "owner": owner_value,
            "name": "valid with owner 2",
            "type": 1,
            "start_time_utc": "09:00",
            "end_time_utc": "11:00",
            "eventDates": [{"date": "2020-01-28"}, {"date": "2020-01-02"}],
        }
        headers = {"Authorization": "1bc84a76-57f0-4678-82a0-9092c2edf8c5"}

        response = self.client.post(
            self.BASE_URL, valid_request_payload, headers=headers, format="json"
        )

        self.assertEqual(response.status_code, 201)

    def test_create_event_resource_without_authorization_header_returns_401(self):
        """
        Test create event resource without authorization header returns 401
        Test Pass criteria:
            - Make a POST /api/v1/events and does not authorization header
            - Pass if response status code = 401
        """
        valid_request_payload = {
            "name": "valid without owner",
            "type": 1,
            "start_time_utc": "09:00",
            "end_time_utc": "11:00",
            "eventDates": [{"date": "2020-01-28"}, {"date": "2020-01-02"}],
        }

        response = self.client.post(self.BASE_URL, valid_request_payload, format="json")

        self.assertEqual(response.status_code, 401)

    def test_create_event_resource_with_incorrect_authorization_token_value_returns_401(
        self,
    ):
        """
        Test create event resource with incorrect authorization token value returns 401
        Test Pass criteria:
            - Make a POST /api/v1/events and provide incorrect authorization token
            - Pass if response status code = 401
        """
        valid_request_payload = {
            "name": "valid without owner",
            "type": 1,
            "start_time_utc": "09:00",
            "end_time_utc": "11:00",
            "eventDates": [{"date": "2020-01-28"}, {"date": "2020-01-02"}],
        }

        invalid_header = {"Authorization": "123"}
        response = self.client.post(
            self.BASE_URL, valid_request_payload, headers=invalid_header, format="json"
        )

        self.assertEqual(response.status_code, 401)

    def test_create_event_resource_without_owner_returns_400(self):
        """
        Test create event resource without owner field value returns 400 Not OK
        Test Pass criteria:
            - Make a POST /api/v1/events and does not provide owner field value
            - Pass if response status code = 400
        """
        headers = {"Authorization": "1bc84a76-57f0-4678-82a0-9092c2edf8c5"}

        valid_request_payload = {
            "name": "valid without owner",
            "type": 1,
            "start_time_utc": "09:00",
            "end_time_utc": "11:00",
            "eventDates": [{"date": "2020-01-28"}, {"date": "2020-01-02"}],
        }

        response = self.client.post(
            self.BASE_URL, valid_request_payload, headers=headers, format="json"
        )

        self.assertEqual(response.status_code, 400)

    def test_create_event_resource_fail_due_to_invalid_time_value_returns_400(self):
        """
        Test create event resource with invalid start_time_utc/end_time_utc value returns 400 NOT OK
        Test Pass criteria:
            - Make a POST /api/v1/events and provide invalid start_time_utc/end_time_utc
            - Pass if response status code = 400
        """
        headers = {"Authorization": "1bc84a76-57f0-4678-82a0-9092c2edf8c5"}

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
                    "owner": "-1",
                    "name": "valid without owner",
                    "type": 1,
                },
            }
            response_status_code = self.client.post(
                self.BASE_URL, request_payload, format="json", headers=headers
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

        headers = {"Authorization": "1bc84a76-57f0-4678-82a0-9092c2edf8c5"}

        invalid_request_payload = {
            "owner": "-1",
            "name": "valid without owner",
            "type": 3,
            "start_time_utc": "09:00",
            "end_time_utc": "11:00",
        }

        response = self.client.post(
            self.BASE_URL, invalid_request_payload, format="json", headers=headers
        )

        self.assertEqual(response.status_code, 400)

    def test_get_event_by_eventid_success_return_200(self):
        """
        Test get specific event by event_id returns all required fields
        Test Pass criteria:
            - Make a GET /api/v1/events/<event_id>
            - Pass if response status code = 200
        """
        call_command("seed_db_dates")
        valid_event_id = Event.objects.all().first().id
        headers = {"Authorization": "1bc84a76-57f0-4678-82a0-9092c2edf8c5"}

        response = self.client.get(
            f"{self.BASE_URL}/{valid_event_id}", headers=headers, format="json"
        )

        self.assertEqual(response.status_code, 200)

    def test_get_event_by_invalid_eventid_returns_400(self):
        """
        Test get specific event using event_id that is not UUID type returns 400
        Test Pass criteria:
            - Make a GET /api/v1/events/<event_id> using invalid event_id
            - Pass if response status code = 400
        """
        invalid_event_id = "123456"

        headers = {"Authorization": "1bc84a76-57f0-4678-82a0-9092c2edf8c5"}

        response = self.client.get(
            f"{self.BASE_URL}/{invalid_event_id}", headers=headers, format="json"
        )

        self.assertEqual(response.status_code, 400)

    def test_get_event_by_incorrect_eventid_returns_404(self):
        """
        Test get specific event using event_id that does not exist returns 404
        Test Pass criteria:
            - Make a GET /api/v1/events/<event_id> using incorrect event_id
            - Pass if response status code = 404
        """
        incorrect_event_id = "914db599-468f-4477-b0a5-ac8c09ea350d"
        headers = {"Authorization": "1bc84a76-57f0-4678-82a0-9092c2edf8c5"}

        response = self.client.get(
            f"{self.BASE_URL}/{incorrect_event_id}", headers=headers, format="json"
        )

        self.assertEqual(response.status_code, 404)
