from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
from .models import *
from django.db.models import Sum

# Create your views here.
#SignUp API
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        fullname=data.get('Fullname')
        email=data.get('Email')
        password = data.get('Password')

        if UserDetails.objects.filter(Email=email).exists():
            return JsonResponse({'message':'Email already exists'},status=400)
        UserDetails.objects.create(Fullname=fullname, Email=email, Password=password)
        return JsonResponse({'message':'User Register Successfully'},status=201)
    
@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email=data.get('Email')
        password = data.get('Password')
        if not email or not password:
                return JsonResponse({'message': 'Email and password are required'}, status=400)
        if not password:
                return JsonResponse({'message': 'Password is required'}, status=400)
        if not email :
                return JsonResponse({'message': 'Email is required'}, status=400)
        try:
            user = UserDetails.objects.get(Email=email)
            if user.Password != password:
                return JsonResponse({'message': 'Invalid Password'}, status=400)
            if user.Password == password:
                return JsonResponse({'message':'User Login Successfully','userId': user.id, 'userName':user.Fullname}, status=200)
        except:
            return JsonResponse({'message':'Invalid Credensials'},status=400)
        
@csrf_exempt
def add_expense(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_Id=data.get('UserId')
        expensedate=data.get('ExpenseDate')
        expensecost = data.get('ExpenseCost')
        expenseitem = data.get('ExpenseItem')
        
        user = UserDetails.objects.get(id = user_Id)
        try:
            Expense.objects.create(UserId=user,ExpenseDate=expensedate, ExpenseItem=expenseitem,ExpenseCost = expensecost)
            return JsonResponse({'message':'Expense Added Successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'message':'Something went wrong','errpr':str(e)},status=400)
        

@csrf_exempt
def manage_expense(request,user_id):
    if request.method == 'GET':
        
        expenses = Expense.objects.filter(UserId=user_id)
        expenses_list = list(expenses.values())
        return JsonResponse(expenses_list,safe=False)
    
@csrf_exempt
def update_expense(request,expense_id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        try:

            expense = Expense.objects.get(id=expense_id)
            expense.ExpenseDate = data.get('ExpenseDate',expense.ExpenseDate)
            expense.ExpenseItem = data.get('ExpenseItem',expense.ExpenseItem)
            expense.ExpenseCost = data.get('ExpenseCost',expense.ExpenseCost)
            expense.save()
            return JsonResponse({'message' : 'Expense Upadated Successfully'})

        except:
            return JsonResponse({'message' : 'Expense Upadated Failed'},status=404)


@csrf_exempt
def delete_expense(request,expense_id):
    if request.method == 'DELETE':
        try:

            expense = Expense.objects.get(id=expense_id)
            expense.delete()
            return JsonResponse({'message' : 'Expense Deleted Successfully'})

        except:
            return JsonResponse({'message' : 'Expense Deletion Failed'},status=404)



@csrf_exempt
def search_expense(request,user_id):
    if request.method == 'GET':
        from_date = request.GET.get('from')
        to_date = request.GET.get('to')
        expenses = Expense.objects.filter(UserId=user_id,ExpenseDate__range=[from_date,to_date]) #__range it is django ORM field lookup expretion where we can       retrive data from to fields having range (eg. 2 date, 2 timestamp, 2 number)
        expenses_list = list(expenses.values())
        
        #ORM aggregate fun 
        agg = expenses.aggregate(Sum('ExpenseCost'))
        total = agg['ExpenseCost__sum'] or 0
        return JsonResponse({'expenses': expenses_list, 'total' : total})
    


@csrf_exempt
def change_password(request, user_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            old_password = data.get('oldPassword')
            new_password = data.get('newPassword')

            user = UserDetails.objects.get(id=user_id)

            if user.Password != old_password:
                return JsonResponse({'message': 'Old Password is incorrect'}, status=400)

            user.Password = new_password
            user.save()

            return JsonResponse({'message': 'Password changed successfully!'}, status=200)

        except UserDetails.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'message': f'Something went wrong: {str(e)}'}, status=400)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)
    