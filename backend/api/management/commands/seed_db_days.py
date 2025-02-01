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
        "type": 2,
        "start_time_utc": "09:00",
        "end_time_utc": "11:00",
        "eventDays": [{"day": "Monday"}, {"day": "Wednesday"}],
    }

    respondent_payload = [
        {
            "name": "Max Martin",
            "isGuestRespondent": True,
            "respondentAvailabilities": [
                {
                    "time": "Monday 09:00",
                },
                {
                    "time": "Monday 10:00",
                },
                {
                    "time": "Monday 11:00",
                },
            ],
        },
        {
            "name": "Max Fury",
            "isGuestRespondent": True,
            "respondentAvailabilities": [
                {
                    "time": "Wednesday 09:00",
                },
                {
                    "time": "Wednesday 10:00",
                },
                {
                    "time": "Wednesday 11:00",
                },
            ],
        },
    ]

    def handle(self, *args: Any, **options: Any) -> str | None:
        day_objects: list[object] = self.event_payload["eventDays"]
        self.event_payload.pop("eventDays")

        # 1. create Event
        created_event = Event.objects.create(**self.event_payload)

        # 2. create Dates related to an event
        day_bulk_create_list = []

        for day_object in day_objects:
            day_unique_id = str(uuid4())
            day_object["event"] = created_event
            day_object["id"] = day_unique_id
            day_bulk_create_list.append(Day(**day_object))

        Day.objects.bulk_create(day_bulk_create_list)

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
