from .auth_tokens import UNAUTHENTICATED_USER_AUTH_TOKEN
from rest_framework.response import Response
from rest_framework import status


def validate_auth_token(request) -> bool:
    """
    Validate unauthenticated users have passed in `Authorization` field into request header.
    To ensure API services can only be called by frontend app and not any other users.
    """
    if "HTTP_AUTHORIZATION" not in request.META.keys():
        print("HTTP_AUTHORIZATION is not present")
        return False
    request_auth = request.META["HTTP_AUTHORIZATION"]
    if request_auth != UNAUTHENTICATED_USER_AUTH_TOKEN:
        print("HTTP_AUTHORIZATION is incorrect")
        return False
    return True
