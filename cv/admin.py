from django.contrib import admin

from .models import Project, Experience, ExperienceActivity, Skill, \
                    SocialNetwork


admin.site.register(Project)
admin.site.register(Skill)
admin.site.register(Experience)
admin.site.register(ExperienceActivity)
admin.site.register(SocialNetwork)
