from django.db.models import Model
from django.db.models.fields import (
    BooleanField, DateField, CharField, URLField, TextField, IntegerField,
    PositiveSmallIntegerField
)
from django.db.models.fields.related import ForeignKey
from django.db.models.deletion import CASCADE

from ordered_model.models import OrderedModel


class Project(Model):
    name = CharField(max_length=50, unique=True)
    url = URLField()

    def __str__(self):
        return self.name


class Skill(Model):
    name = CharField(max_length=50, unique=True)
    level = PositiveSmallIntegerField()
    order = PositiveSmallIntegerField()
    main = BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('main', 'order')
        ordering = ['main', 'order', 'level']


class Experience(Model):
    CATEGORY_JOB = 0
    CATEGORY_EDUCATION = 1
    CATEGORY_VOLUNTEERING = 2

    CATEGORY_CHOICES = (
        (CATEGORY_JOB, 'Job'),
        (CATEGORY_EDUCATION, 'Education'),
        (CATEGORY_VOLUNTEERING, 'Volunteering'),
    )

    name = CharField(max_length=50, unique=True)
    category = IntegerField(default=CATEGORY_JOB, choices=CATEGORY_CHOICES)
    date_start = DateField()
    date_stop = DateField()

    def __str__(self):
        return self.name


class ExperienceActivity(OrderedModel):
    experience = ForeignKey(
        'Experience',
        related_name='activities', on_delete=CASCADE
    )
    description = TextField()

    def __str__(self):
        return self.experience.name + ': ' + self.description[:10]

    class Meta(OrderedModel.Meta):
        unique_together = ('experience', 'order')
        ordering = ('experience', 'order')
        verbose_name_plural = 'Experience Activities'


class SocialNetwork(OrderedModel):
    name = CharField(max_length=50, unique=True)
    url = URLField()

    def __str__(self):
        return self.name

    class Meta(OrderedModel.Meta):
        pass

