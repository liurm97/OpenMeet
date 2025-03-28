# Generated by Django 5.1.4 on 2025-03-19 03:12

import django.core.validators
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_availability_id_alter_availability_time_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='agenda',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AlterField(
            model_name='availability',
            name='id',
            field=models.CharField(db_index=True, default=uuid.UUID('aee4a5b5-15c4-49da-9792-aed33bb9291a'), primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='availability',
            name='time',
            field=models.CharField(validators=[django.core.validators.RegexValidator(message='Valid availability time must be one of the following formats - [yyyy-mm-dd hh:00 or hh:30] or [day_of_week hh:00 or hh:30] ', regex='((Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)|^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01]))\\s(0[0-9]{1}|1[0-9]{1}|2[0-3]{1}):00$|(0[0-9]{1}|1[0-9]{1}|2[0-3]{1}):30$')]),
        ),
        migrations.AlterField(
            model_name='date',
            name='id',
            field=models.CharField(db_index=True, default=uuid.UUID('45ef36d5-e307-46be-a349-caf402a175ca'), primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='day',
            name='id',
            field=models.CharField(db_index=True, default=uuid.UUID('173e98f5-30e7-4f22-950e-2001969ad496'), primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='event',
            name='id',
            field=models.CharField(db_index=True, default=uuid.UUID('2938ddbc-850a-43a4-97e4-d973f3d1bf59'), primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='respondent',
            name='id',
            field=models.CharField(db_index=True, default=uuid.UUID('8e841006-70ba-443c-8fde-9eb39a7b881c'), primary_key=True, serialize=False),
        ),
    ]
