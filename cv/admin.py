from django.contrib import admin

from ordered_model.admin import OrderedModelAdmin

from .models import (
    Project, Experience, ExperienceActivity, Skill, SocialNetwork
)


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
admin.site.register(Skill)
admin.site.register(Experience)
admin.site.register(ExperienceActivity, ExperienceActivityAdmin)
admin.site.register(SocialNetwork, SocialNetworkAdmin)
