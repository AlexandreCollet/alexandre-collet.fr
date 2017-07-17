# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-14 14:52
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0009_project_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectTechnology',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(db_index=True, editable=False)),
                ('name', models.CharField(max_length=50)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='technologies', to='cv.Project')),
            ],
            options={
                'verbose_name_plural': 'Project Technologies',
                'ordering': ('project', 'order'),
                'abstract': False,
            },
        ),
        migrations.AlterUniqueTogether(
            name='projecttechnology',
            unique_together=set([('project', 'name')]),
        ),
    ]