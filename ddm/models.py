from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4
from datetime import datetime

def get_file_path(instance, filename):
    ymd_path = datetime.now().strftime('%Y/%m/%d')
    #uuid_name = uuid4().hex
    return '/'.join(['files/', ymd_path])

class Question(models.Model):
    subject = models.CharField(max_length=200)
    content = models.TextField()
    #image = models.ImageField()
    create_date = models.DateTimeField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    modify_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return self.subject

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    content = models.TextField()
    create_date = models.DateTimeField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    modify_date = models.DateTimeField(null=True, blank=True)

class Library(models.Model):
    subject = models.CharField(max_length=200)
    content = models.TextField()
    files = models.FileField(null=True, blank=True, upload_to=get_file_path)
    #photo = models.ImageField(upload_to="")

class Post(models.Model):
    subject = models.CharField(max_length=200)
    content = models.TextField()
    #image = models.ImageField()
    create_date = models.DateTimeField()
    modify_date = models.DateTimeField(null=True, blank=True)

class Comment(models.Model):
    question = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    create_date = models.DateTimeField()
    modify_date = models.DateTimeField(null=True, blank=True)

class Course_Question(models.Model):
    subject = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField()
    create_date = models.DateTimeField()