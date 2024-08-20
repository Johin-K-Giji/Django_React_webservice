from django.db import models

class Friend(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    friends = models.ManyToManyField(Friend, blank=True, related_name='users')

    def __str__(self):
        return self.name
