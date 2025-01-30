from ...models import Event, Date, Day, Respondent, Availability

from typing import Any
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Clears and reset database"

    def handle(self, *args: Any, **options: Any) -> str | None:
        Event.objects.all().delete()
        print("Clear db done!")
