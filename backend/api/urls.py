from django.urls import path
from . import views

urlpatterns = [
    # ---- Events ---- #
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
