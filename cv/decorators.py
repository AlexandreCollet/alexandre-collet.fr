import os
from uuid import uuid4

from django.utils.deconstruct import deconstructible


@deconstructible
class UploadToPathAndRename(object):
    def __init__(self, path):
        self.sub_path = path

    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        uuid = uuid4().hex
        filename = '{}.{}'.format(uuid, ext)
        return os.path.join(self.sub_path, filename)
