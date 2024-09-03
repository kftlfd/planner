from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view()
def bad_request(request):
    return Response("Wrong API usage", status=status.HTTP_400_BAD_REQUEST)
