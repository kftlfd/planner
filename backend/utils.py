from random import choice as rand_choice

from .apps import BackendConfig
from .models import Project


chars = \
    [chr(x) for x in range(ord('0'), ord('9') + 1)] + \
    [chr(x) for x in range(ord('a'), ord('z') + 1)] + \
    [chr(x) for x in range(ord('A'), ord('Z') + 1)]


def rand_invite_code():
    return "".join([rand_choice(chars) for _ in range(BackendConfig.invite_code_length)])


def new_invite_code():
    code = rand_invite_code()
    # check if code is unique
    while Project.objects.filter(invite=code):
        code = rand_invite_code()
    return code
