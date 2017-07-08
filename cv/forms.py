from django.conf import settings
from django.forms import Form
from django.forms import CharField, EmailField
from django.forms import Textarea
from django.core.mail import send_mail


class ContactForm(Form):
    full_name = CharField(label='Full name', min_length=2, max_length=100)
    email = EmailField(label='Email')
    message = CharField(label='Message', widget=Textarea)

    def send_email(self):
        full_name = self.cleaned_data['full_name']
        subject = (
            "Message de " + full_name + " "
            "envoyé depuis le formulaire de contact"
        )
        message = self.cleaned_data['message']
        from_email = self.cleaned_data['email']
        recipient_list = [settings.EMAIL_RECIPIENT]

        try:
            send_mail(
                subject, message, from_email, recipient_list,
                fail_silently=False
            )
        except:
            return False

        return True
