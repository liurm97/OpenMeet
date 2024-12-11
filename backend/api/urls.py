from django.urls import path
from . import views

# urlpatterns = [path("events/", views.EventListView.as_view(), name="event-view-get")]
urlpatterns = [
    path("events", views.get_all_events, name="get-all-events"),
    path("events/<str:pk>", views.get_event_by_pk, name="get-event-by-pk"),
]
