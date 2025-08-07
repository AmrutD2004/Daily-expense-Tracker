from django.db import models

# Create your models here.

class UserDetails(models.Model):
    Fullname = models.CharField(max_length=75)
    Email = models.EmailField(max_length=75, unique=True)
    Password = models.CharField(max_length=75)
    RegDate = models.DateField(auto_now_add=True)

class Expense(models.Model):
    UserId = models.ForeignKey(UserDetails,on_delete=models.CASCADE)
    ExpenseItem = models.CharField(max_length=75)
    ExpenseCost = models.DecimalField(max_digits=75, decimal_places=2)
    ExpenseDate = models.DateField(null=True, blank=True)
    NoteDate = models.DateTimeField(auto_now_add=True)