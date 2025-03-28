# Generated by Django 5.1.4 on 2025-03-20 03:03

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_event_agenda_alter_availability_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='availability',
            old_name='time',
            new_name='time_utc',
        ),
        migrations.AlterField(
            model_name='availability',
            name='id',
            field=models.CharField(db_index=True, default=uuid.UUID('34818072-c9e3-43a7-8713-16339b7580d4'), primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='date',
            name='id',
            field=models.CharField(db_index=True, default=uuid.UUID('d5a45092-172e-4766-a5f5-a13a6ee65526'), primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='day',
            name='id',
            field=models.CharField(db_index=True, default=uuid.UUID('8408defe-9c27-49cd-8d30-583910358a50'), primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='event',
            name='id',
            field=models.CharField(db_index=True, default=uuid.UUID('736a3e3d-3449-4005-8748-a91deadec2e9'), primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='respondent',
            name='id',
            field=models.CharField(db_index=True, default=uuid.UUID('8e12afdc-9571-4a97-a453-9de4cca02697'), primary_key=True, serialize=False),
        ),
    ]
