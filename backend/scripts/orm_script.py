from api.models import Event


def run():
    event = Event.objects.first()
    print(event.isValidTime)
