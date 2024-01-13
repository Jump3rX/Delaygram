from django.shortcuts import render
from django.http import HttpResponse
from .models import Posts
from .serializers import PostsSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def index(request):
    urls = {
        'All Posts':'posts',
        'View single post':'post/<uuid:id>',
        'Create post':'create-post',
        'Delete post':'delete-post/<uuid:id>',
        'Edit post':'edit-post/<uuid:id>',
    }
    return Response(urls)


@api_view(['GET'])
def listPosts(request):
    posts = Posts.objects.all().order_by('?')
    list = PostsSerializer(posts,many=True)
    #print(list.data)
    return Response(list.data)

@api_view(['GET'])
def postDetails(request,id):
    post = Posts.objects.get(id=id)
    serializer = PostsSerializer(post,many=False)
    return Response(serializer.data)


@api_view(['POST'])
def makePost(request):
    serializer = PostsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def editPost(request,id):
    post = Posts.objects.get(id=id)
    serializer = PostsSerializer(instance=post,data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
def deletePost(request,id):
    post = Posts.objects.get(id=id)
    post.delete()
    return Response('Post Deleted!')