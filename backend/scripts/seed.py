from django_seed import Seed
from api.models import Event, Respondent, Date, Availability
from faker import *
import random
from uuid import uuid4
import datetime

seeder = Seed.seeder()
s = "dbe6d7f9-033f-42b4-b08e-b0d9479c0fcf"


def seed_event_and_5_dates(date_type: str):
    seeder.add_entity(
        Event,
        1,
        {
            "id": uuid4(),
            "name": seeder.faker.city(),
            "type": 1,
            "startTime": "09:00",
            "endTime": "10:00",
        },
    )
    if date_type == "specific_dates":
        seeder.add_entity(
            Date,
            5,
            {
                "id": lambda x: random.randint(1, 100),
                "date": lambda x: Faker().date_between(
                    start_date="today", end_date="+30d"
                ),
                "dayOfWeek": "",
            },
        )
    elif date_type == "days_of_week":
        days_of_week = ["Monday", "Tuesday", "Wednesday"]

        def return_day(days: list[str]):
            random_ind = random.randint(0, len(days) - 1)
            return days[random_ind]

        seeder.add_entity(
            Date,
            5,
            {
                "id": lambda x: random.randint(1, 100),
                "date": "",
                "dayOfWeek": lambda x: return_day(days_of_week),
            },
        )

    inserted_pks = seeder.execute()
    return


seed_event_and_5_dates(date_type="days_of_week")


# ---- Ad hoc ----- #
# seeder.add_entity(
#     Event,
#     10,
#     {
#         "id": lambda x: random.randint(1, 100),
#         "owner": uuid4(),
#         "name": lambda x: seeder.faker.city(),
#         "type": random.randint(1, 2),
#         "startTime": "09:00",
#         "endTime": "10:00",
#     },
# )
# seeder.add_entity(
#     Respondent,
#     1,
#     {
#         "id": uuid4(),
#         "name": lambda x: seeder.faker.name(),
#         "isGuestUser": False,
#         # "eventRespondent_id": "10:00",
#     },
# )
# seeder.add_entity(
#     Date,
#     1,
#     {
#         "id": uuid4(),
#         "date": "2024-12-11",
#         "dayOfWeek": "",
#         # "eventRespondent_id": "10:00",
#     },
# )

# seeder.add_entity(
#     Availability,
#     1,
#     {
#         "id": uuid4(),
#         "time": datetime.datetime.now(datetime.timezone.utc),
#         # "time": "2024-12-11T12:30:00+00",
#         # "eventRespondent_id": "10:00",
#     },
# )

# inserted_pks = seeder.execute()
