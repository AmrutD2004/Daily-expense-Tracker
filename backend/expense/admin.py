from django.contrib import admin
from .models import UserDetails, Expense
# Register your models here.


class AdminUserDetails(admin.ModelAdmin):
    list_display = ['Fullname', 'Email', 'Password']

class AdminExpeses(admin.ModelAdmin):
    list_display = ['ExpenseDate', 'ExpenseItem', 'ExpenseCost']

admin.site.register(UserDetails, AdminUserDetails)
admin.site.register(Expense, AdminExpeses)