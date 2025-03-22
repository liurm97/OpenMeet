from django.urls import path
from .views import (
    views_availability,
    views_date,
    views_day,
    views_event,
    views_respondent,
)


urlpatterns = [
    # ---- Events ---- #
    path("v1/events", views_event.CreateEventView.as_view(), name="create-event"),
    path(
        "v1/events/<str:event_id>",
        views_event.SpecificEventView.as_view(),
        name="specific-event-by-eventid",
    ),
    path(
        "v1/events/<str:event_id>/availabilities",
        views_availability.AddEventAvailabilityView.as_view(),
        name="specific-event-availabilities-by-eventid",
    ),
    # path("events", views.get_all_or_create_event, name="get-all-or-create-event"),
    # path("events/<str:event_id>", views.get_event_by_pk, name="get-event-by-pk"),
    # path(
    #     "events/<str:event_id>/respondents",
    #     views.get_all_or_create_respondent_by_event,
    #     name="create-respondent-by-event",
    # ),
    # path(
    #     "events/<str:event_id>/respondents/<str:respondent_id>",
    #     views.get_respondent_by_event,
    #     name="create-respondent-by-event",
    # ),
    # ---- Respondents ---- #
    # ---- Availabilities ---- #
]
