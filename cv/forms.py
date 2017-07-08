from django.conf import settings
from django.forms import Form
from django.forms import CharField, EmailField
from django.forms import Textarea
from django.core.mail import EmailMessage


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
        from_email = '{full_name} <{email}>'.format(
            full_name=full_name,
            email=settings.EMAIL_SENDER
        )
        recipient_list = [settings.EMAIL_RECIPIENT]
        reply_to_list = [self.cleaned_data['email']]

        email = EmailMessage(subject, message)
        email.subject = subject
        email.body = message
        email.from_email = from_email
        email.to = recipient_list
        email.reply_to = reply_to_list

        try:
            email.send()
        except:
            return False

        return True
