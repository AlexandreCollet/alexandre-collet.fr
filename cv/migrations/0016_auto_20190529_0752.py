# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-05-29 07:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0015_auto_20190528_0641'),
    ]

    operations = [
        migrations.AddField(
            model_name='resume',
            name='docker',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='resume',
            name='github',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='resume',
            name='linkedin',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='resume',
            name='twitter',
            field=models.URLField(blank=True, null=True),
        ),
    ]
