from . import views
from django.urls import path

urlpatterns = [
    path('',views.index,name='index'),
    path('posts/',views.listPosts,name='posts'),
    path('post/<uuid:id>/',views.postDetails,name='post'),
    path('create-post/',views.makePost,name='create-post'),
    path('edit-post/<uuid:id>/',views.editPost,name='edit-post'),
    path('delete-post/<uuid:id>/',views.deletePost,name='delete-post'),
]