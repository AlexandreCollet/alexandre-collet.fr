# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-05-29 08:19
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0016_auto_20190529_0752'),
    ]

    operations = [
        migrations.DeleteModel(
            name='SocialNetwork',
        ),
    ]