from rest_framework import serializers
from .models import User, Friend

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    friends = FriendSerializer(many=True, read_only=True)
    friend_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Friend.objects.all(), write_only=True, source='friends'
    )

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'friends', 'friend_ids']
