from django.contrib import admin
from django.contrib.admin import ModelAdmin

from ordered_model.admin import OrderedModelAdmin

from cv.models import (
    Resume, Project, ProjectLink, ProjectTechnology, ProjectScreenshot,
    Experience, ExperienceActivity, Skill, SocialNetwork
)


@admin.register(Resume)
class ResumeAdmin(ModelAdmin):
    list_display = ('__str__', 'title')
    list_display_links = ('__str__', )


@admin.register(Project)
class ProjectAdmin(OrderedModelAdmin):
    list_display = ('move_up_down_links', '__str__', 'name')
    list_display_links = ('__str__', )


@admin.register(ProjectLink)
class ProjectLinkAdmin(OrderedModelAdmin):
    list_display = (
        'move_up_down_links', '__str__', 'project_name', 'name'
    )
    list_display_links = ('__str__', )

    def project_name(self, obj):
        return obj.project.name
    project_name.short_description = 'Project'


@admin.register(ProjectTechnology)
class ProjectTechnologyAdmin(OrderedModelAdmin):
    list_display = (
        'move_up_down_links', '__str__', 'project_name', 'name'
    )
    list_display_links = ('__str__', )

    def project_name(self, obj):
        return obj.project.name
    project_name.short_description = 'Project'


@admin.register(ProjectScreenshot)
class ProjectScreenshotAdmin(OrderedModelAdmin):
    list_display = (
        'move_up_down_links', '__str__', 'project_name', 'name'
    )
    list_display_links = ('__str__', )

    def project_name(self, obj):
        return obj.project.name
    project_name.short_description = 'Project'


@admin.register(Skill)
class SkillAdmin(OrderedModelAdmin):
    list_display = ('move_up_down_links', '__str__', 'name', 'level', 'main')
    list_display_links = ('__str__', )


@admin.register(Experience)
class ExperienceAdmin(ModelAdmin):
    list_display = ('__str__', 'category', 'name')
    list_display_links = ('__str__', )


@admin.register(ExperienceActivity)
class ExperienceActivityAdmin(OrderedModelAdmin):
    list_display = (
        'move_up_down_links', '__str__', 'experience_name', 'description'
    )
    list_display_links = ('__str__', )

    def experience_name(self, obj):
        return obj.experience.name
    experience_name.short_description = 'Experience'


@admin.register(SocialNetwork)
class SocialNetworkAdmin(OrderedModelAdmin):
    list_display = ('move_up_down_links', '__str__', 'name', 'url')
    list_display_links = ('__str__', )
