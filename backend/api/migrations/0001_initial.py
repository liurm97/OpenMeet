# Generated by Django 5.1.4 on 2024-12-12 16:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Event",
            fields=[
                (
                    "id",
                    models.UUIDField(db_index=True, primary_key=True, serialize=False),
                ),
                ("owner", models.CharField(default="-1")),
                ("name", models.CharField(max_length=200)),
                (
                    "type",
                    models.IntegerField(
                        choices=[(1, "Specific dates"), (2, "Days of the week")],
                        default=2,
                    ),
                ),
                ("startTime", models.CharField(max_length=200)),
                ("endTime", models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name="Date",
            fields=[
                (
                    "id",
                    models.UUIDField(db_index=True, primary_key=True, serialize=False),
                ),
                (
                    "date",
                    models.CharField(blank=True, default="", max_length=100, null=True),
                ),
                (
                    "dayOfWeek",
                    models.CharField(blank=True, default="", max_length=100, null=True),
                ),
                (
                    "event",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="eventDate",
                        to="api.event",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Respondent",
            fields=[
                (
                    "id",
                    models.UUIDField(db_index=True, primary_key=True, serialize=False),
                ),
                ("name", models.CharField(max_length=100)),
                ("isGuest", models.BooleanField()),
                (
                    "eventRespondent",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="eventRespondent",
                        to="api.event",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Availability",
            fields=[
                (
                    "id",
                    models.UUIDField(db_index=True, primary_key=True, serialize=False),
                ),
                ("time", models.DateTimeField()),
                (
                    "respondent",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="respondent",
                        to="api.respondent",
                    ),
                ),
            ],
        ),
    ]
