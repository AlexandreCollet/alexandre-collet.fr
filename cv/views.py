from django.conf import settings
from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView
from django.views.decorators.csrf import requires_csrf_token
from django.template import loader
from django.http import (
    HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound,
    HttpResponseServerError, JsonResponse
)

from github import Github

from .models import Skill, Experience, Project, SocialNetwork
from .forms import ContactForm


class IndexView(TemplateView):
    http_method_names = ['get']
    template_name = 'cv/index.html'

    def get_context_data(self, **kwargs):
        github_client = Github(settings.GITHUB_TOKEN)

        context = {}
        context['repositories'] = github_client.get_user().get_repos()
        context['projects'] = Project.objects.all().prefetch_related(
            'technologies', 'links', 'screenshots'
        )
        context['social_networks'] = SocialNetwork.objects.all()
        context['skills'] = {
            'mains': Skill.objects.filter(main=True).all(),
            'others': Skill.objects.filter(main=False).all(),
        }
        context['experiences'] = {
            'job': Experience.objects.filter(
                category=Experience.CATEGORY_JOB).all(),
            'volunteering': Experience.objects.filter(
                category=Experience.CATEGORY_VOLUNTEERING).all(),
            'education': Experience.objects.filter(
                category=Experience.CATEGORY_EDUCATION).all(),
        }
        context['contact_form'] = ContactForm(
            auto_id='contact_form_%s_field', label_suffix=''
        )

        return context


class ContactView(FormView):
    http_method_names = ['post']
    form_class = ContactForm

    def form_valid(self, form):
        email_sent = form.send_email()

        if email_sent:
            response = {
                'type': 'success',
                'message': 'Message envoyé avec succès.'
            }
        else:
            response = {
                'type': 'error',
                'message': 'Une erreur est survenue.'
            }

        return JsonResponse(response)

    def form_invalid(self, form):
        response = {
            'type': 'error',
            'message': 'Tous les champs ne sont pas valides.'
        }
        return JsonResponse(response)


@requires_csrf_token
def error400(request, exception):
    template_name = 'cv/error.html'
    context = {
        'error_code': 400,
        'error_detail': 'Bad Request.'
    }

    template = loader.get_template(template_name)
    body = template.render(context, request)

    return HttpResponseBadRequest(body)


@requires_csrf_token
def error403(request, exception):
    template_name = 'cv/error.html'
    context = {
        'error_code': 403,
        'error_detail': 'Forbidden.'
    }

    template = loader.get_template(template_name)
    body = template.render(context, request)

    return HttpResponseForbidden(body)


@requires_csrf_token
def error404(request, exception):
    template_name = 'cv/error.html'
    context = {
        'error_code': 404,
        'error_detail': 'Page not found.'
    }

    template = loader.get_template(template_name)
    body = template.render(context, request)

    return HttpResponseNotFound(body)


@requires_csrf_token
def error500(request, exception):
    template_name = 'cv/error.html'
    context = {
        'error_code': 500,
        'error_detail': 'Server error.'
    }

    template = loader.get_template(template_name)
    body = template.render(context, request)

    return HttpResponseServerError(body)
