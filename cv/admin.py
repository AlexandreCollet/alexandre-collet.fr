from django.contrib import admin

from ordered_model.admin import OrderedModelAdmin

from .models import (
    Project, Experience, ExperienceActivity, Skill, SocialNetwork
)



class SocialNetworkAdmin(OrderedModelAdmin):
    list_display = ('move_up_down_links', '__str__', 'name', 'url')
    list_display_links = ('__str__', )


admin.site.register(Project)
admin.site.register(Skill)
admin.site.register(Experience)
admin.site.register(ExperienceActivity)
admin.site.register(SocialNetwork, SocialNetworkAdmin)
