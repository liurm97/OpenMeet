"""
Django admin
"""

from django.contrib import admin
from .models import Event, Date, Availability, Respondent


class EventAdmin(admin.ModelAdmin):
    """
    Define admin page for Events
    """

    ordering = ["owner"]
    list_display = [
        "id",
        "owner",
        "name",
        "type",
        "startTime",
        "endTime",
    ]


class DateAdmin(admin.ModelAdmin):
    """
    Define admin page for Events
    """

    # ordering = ["owner"]
    list_display = ["id", "date", "dayOfWeek"]
    fields = ["id", "event", "date"]


admin.site.register(Event, EventAdmin)
admin.site.register(Date, DateAdmin)
