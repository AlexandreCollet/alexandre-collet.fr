from django.db.models import Model
from django.db.models.fields import (
    BooleanField, DateField, CharField, URLField, TextField, IntegerField,
    PositiveSmallIntegerField
)
from django.db.models.fields.files import ImageField
from django.db.models.fields.related import ForeignKey
from django.db.models.deletion import CASCADE
from django.utils.text import slugify

from ordered_model.models import OrderedModel

from cv.decorators import UploadToPathAndRename


class Project(OrderedModel):
    name = CharField(max_length=50, unique=True)
    description = TextField(blank=True)

    @property
    def slug(self):
        return slugify(self.name)

    def __str__(self):
        return self.name

    class Meta(OrderedModel.Meta):
        pass


class ProjectLink(OrderedModel):
    project = ForeignKey(
        'Project',
        related_name='links', on_delete=CASCADE
    )
    name = CharField(max_length=50)
    url = URLField(unique=True)
    icon = CharField(max_length=10, blank=True)

    def __str__(self):
        return self.project.name + ' - ' + self.name

    class Meta(OrderedModel.Meta):
        unique_together = ('project', 'name')
        ordering = ('project', 'order')
        verbose_name_plural = 'Project Links'


class ProjectTechnology(OrderedModel):
    project = ForeignKey(
        'Project',
        related_name='technologies', on_delete=CASCADE
    )
    name = CharField(max_length=50)

    def __str__(self):
        return self.project.name + ' - ' + self.name

    class Meta(OrderedModel.Meta):
        unique_together = ('project', 'name')
        ordering = ('project', 'order')
        verbose_name_plural = 'Project Technologies'


class ProjectScreenshot(OrderedModel):
    project = ForeignKey(
        'Project',
        related_name='screenshots', on_delete=CASCADE
    )
    name = CharField(max_length=255)
    image = ImageField(
        upload_to=UploadToPathAndRename('cv/projects/screenshots')
    )

    def __str__(self):
        return self.project.name + ' - ' + self.name

    class Meta(OrderedModel.Meta):
        unique_together = ('project', 'name')
        ordering = ('project', 'order')
        verbose_name_plural = 'Project Screenshots'


class Skill(OrderedModel):
    name = CharField(max_length=50, unique=True)
    level = PositiveSmallIntegerField()
    main = BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta(OrderedModel.Meta):
        ordering = ('main', 'order', 'level')


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
    date_stop = DateField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('-date_start', )


class ExperienceActivity(OrderedModel):
    experience = ForeignKey(
        'Experience',
        related_name='activities', on_delete=CASCADE
    )
    description = TextField()

    def __str__(self):
        return self.experience.name + ': ' + self.description[:10]

    class Meta(OrderedModel.Meta):
        ordering = ('experience', 'order')
        verbose_name_plural = 'Experience Activities'


class SocialNetwork(OrderedModel):
    name = CharField(max_length=50, unique=True)
    url = URLField()

    def __str__(self):
        return self.name

    class Meta(OrderedModel.Meta):
        pass

