# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-14 16:42
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0010_auto_20170714_1452'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectLink',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(db_index=True, editable=False)),
                ('name', models.CharField(max_length=50)),
                ('url', models.URLField(unique=True)),
                ('icon', models.CharField(blank=True, max_length=10)),
            ],
            options={
                'verbose_name_plural': 'Project Links',
                'ordering': ('project', 'order'),
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='project',
            name='url',
        ),
        migrations.AddField(
            model_name='projectlink',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='links', to='cv.Project'),
        ),
        migrations.AlterUniqueTogether(
            name='projectlink',
            unique_together=set([('project', 'name')]),
        ),
    ]
