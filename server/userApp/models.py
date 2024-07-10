from django.db import models

from django.contrib.auth.models import User

# just incase if need to customise user
# class User(AbstractUser):
#     # Additional user profile fields (optional)
#     pass


class Interest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_interests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_interests')
    # message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')])
    created_at = models.DateTimeField(auto_now_add=True)



class Messages(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_message')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_message')
    message = models.CharField(max_length=1000)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']
        # verbos_plural_name = "Message"
    
    def __str__(self):
        return f"{self.sender} - {self.receiver}"