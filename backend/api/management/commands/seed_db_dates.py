from ...models import Event, Date, Day, Respondent, Availability

from typing import Any
from django.core.management.base import BaseCommand
from uuid import uuid4


class Command(BaseCommand):
    help = """
        Seed database to simulate retrieving a specific event should return:
        - Event
        - Date or Day
        - Respondent
        - Availability
    """

    event_payload = {
        "name": "seed_db:: valid without owner 1",
        "owner": "0344802b-227c-4be4-bf9f-d2deb3a5d82e",
        "type": 1,
        "start_time_utc": "09:00",
        "end_time_utc": "11:00",
        "eventDates": [{"date": "2020-01-28"}, {"date": "2020-01-02"}],
    }

    respondent_payload = [
        {
            "name": "Max Martin",
            "isGuestRespondent": True,
            "respondentAvailabilities": [
                {
                    "time": "2020-01-02 09:00",
                },
                {
                    "time": "2020-01-02 10:00",
                },
                {
                    "time": "2020-01-02 11:00",
                },
            ],
        },
        {
            "name": "Max Fury",
            "isGuestRespondent": True,
            "respondentAvailabilities": [
                {
                    "time": "2020-01-28 09:00",
                },
                {
                    "time": "2020-01-28 10:00",
                },
                {
                    "time": "2020-01-28 11:00",
                },
            ],
        },
    ]

    def handle(self, *args: Any, **options: Any) -> str | None:
        date_objects: list[object] = self.event_payload["eventDates"]
        self.event_payload.pop("eventDates")

        # 1. create Event
        created_event = Event.objects.create(**self.event_payload)

        # 2. create Dates related to an event
        date_bulk_create_list = []

        for date_object in date_objects:
            date_unique_id = str(uuid4())
            date_object["event"] = created_event
            date_object["id"] = date_unique_id
            date_bulk_create_list.append(Date(**date_object))

        Date.objects.bulk_create(date_bulk_create_list)

        # 3. create Respondents related to an event
        for respondent in self.respondent_payload:

            respondent_unique_id = str(uuid4())
            respondent["id"] = respondent_unique_id
            respondent["respondentEvent"] = created_event
            respondent_availability_object = respondent["respondentAvailabilities"]
            respondent.pop("respondentAvailabilities")
            created_respondent = Respondent.objects.create(**respondent)

            availability_bulk_create_list = list()

            for availability_object in respondent_availability_object:
                availability_unique_id = str(uuid4())
                availability_object["respondentAvailability"] = created_respondent
                availability_object["id"] = availability_unique_id
                availability_bulk_create_list.append(
                    Availability(**availability_object)
                )
            Availability.objects.bulk_create(availability_bulk_create_list)

        print("Seeding done! Ready for test!!!")
