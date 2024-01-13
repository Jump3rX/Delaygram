from django.db import models
import uuid
# Create your models here.
class Posts(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,unique = True)
    post_name = models.CharField(max_length = 150,blank=False,null=True)
    post_user = models.CharField(max_length=50,blank=False,null=True)
    created = models.DateTimeField(auto_now_add=True,blank=False,null=True)

    def formatted_created(self):
        return self.created.strftime("%Y-%m-%d %H:%M:%S")

    def __str__(self):
        return self.post_user
    
