from rest_framework import viewsets
from rest_framework.response import Response
from .models import User, Friend
from .serializers import UserSerializer, FriendSerializer
from rest_framework import status

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        data = request.data
        
        # Update user fields
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        user.save()

        # Update user's friends
        friend_ids = data.get('friend_ids', [])
        user.friends.clear()  # Clear existing friends
        friends = Friend.objects.filter(id__in=friend_ids)
        user.friends.add(*friends)

        serializer = self.get_serializer(user)
        return Response(serializer.data)

class FriendViewSet(viewsets.ModelViewSet):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    def destroy(self, request, *args, **kwargs):
        friend = self.get_object()

        # Check if the friend is associated with any user
        if friend.user_set.exists():
            return Response({"error": "Friend is associated with a user and cannot be deleted."},
                            status=status.HTTP_400_BAD_REQUEST)

        # If not associated with any user, delete the friend
        self.perform_destroy(friend)
        return Response(status=status.HTTP_204_NO_CONTENT)
