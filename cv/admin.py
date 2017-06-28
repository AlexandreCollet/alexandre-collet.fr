from django.contrib import admin
from django.contrib.admin import ModelAdmin

from ordered_model.admin import OrderedModelAdmin

from .models import (
    Project, Experience, ExperienceActivity, Skill, SocialNetwork
)


class SkillAdmin(OrderedModelAdmin):
    list_display = ('move_up_down_links', '__str__', 'name', 'level', 'main')
    list_display_links = ('__str__', )


class ExperienceAdmin(ModelAdmin):
    list_display = ('__str__', 'category', 'name')
    list_display_links = ('__str__', )


class ExperienceActivityAdmin(OrderedModelAdmin):
    list_display = (
        'move_up_down_links', '__str__', 'experience_name', 'description'
    )
    list_display_links = ('__str__', )

    def experience_name(self, obj):
        return obj.experience.name
    experience_name.short_description = 'Experience'


class SocialNetworkAdmin(OrderedModelAdmin):
    list_display = ('move_up_down_links', '__str__', 'name', 'url')
    list_display_links = ('__str__', )


admin.site.register(Project)
admin.site.register(Skill, SkillAdmin)
admin.site.register(Experience, ExperienceAdmin)
admin.site.register(ExperienceActivity, ExperienceActivityAdmin)
admin.site.register(SocialNetwork, SocialNetworkAdmin)
