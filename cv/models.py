from django.db.models import (
    Model, CASCADE,
    BooleanField, DateField, CharField, URLField, TextField, IntegerField,
    PositiveSmallIntegerField, ImageField, FileField, ForeignKey
)
from django.utils.text import slugify

from ordered_model.models import OrderedModel

from cv.decorators import UploadToPathAndRename


class Resume(Model):
    firstname = CharField(max_length=50)
    lastname = CharField(max_length=50)
    title = CharField(max_length=200, null=True, blank=True)
    summary = TextField(null=True, blank=True)
    photo = ImageField(
        null=True,
        blank=True,
        upload_to=UploadToPathAndRename('cv/resumes/photos'),
    )
    pdf_file = FileField(
        null=True,
        blank=True,
        upload_to=UploadToPathAndRename('cv/resumes/pdfs'),
    )

    github = URLField(blank=True, null=True)
    docker = URLField(blank=True, null=True)
    linkedin = URLField(blank=True, null=True)
    twitter = URLField(blank=True, null=True)

    def __str__(self):
        return self.fullname

    @property
    def fullname(self):
        return self.get_fullname()

    def get_fullname(self):
        fullname_format_string = "{firstname} {lastname}"
        fullname_kwargs = {
            'firstname': self.firstname,
            'lastname': self.lastname,
        }

        return fullname_format_string.format(**fullname_kwargs)


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
