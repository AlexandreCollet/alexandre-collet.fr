from django.conf.urls import url

from cv.views import IndexView, ContactView

app_name = 'cv'

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^contact/$', ContactView.as_view(), name='contact')
]
