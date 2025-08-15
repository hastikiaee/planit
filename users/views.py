from django.views import View
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib import messages
from django.contrib.auth import get_user_model,authenticate, login,logout
from django.http import HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.mixins import LoginRequiredMixin,UserPassesTestMixin

from .forms import SignupForm,LoginForm,PasswordResetForm,AdminLoginForm
from .models import StudentList, ProfessorList,CustomUser
from charts.models import Schedule

import random
import threading

#تایین نقش کاربر
def is_student(role):
    return role == 3


#Send Email
def send_verification_email(context, email):
    send_mail(
        message=f"{context}",
        subject="Your verification code",
        from_email="hasti1383kiaee@gmail.com",
        recipient_list=[email]
    )

#signup and verify 
@method_decorator(csrf_exempt, name='dispatch')
class SignupLoginView(View):

    def get(self, request):
        form = SignupForm()
        return render(request, "users/signup.html", context={'form': form})

    def post(self, request): 

        action = request.POST.get('action')
        role = request.POST.get('user_type')

        if role == 'student':
            role = 3
        else:
            role = 1

        # sending code for email and make a session
        if action == 'send_code':
            form = SignupForm(request.POST)
            if form.is_valid():
                username = form.cleaned_data['username']
                password = form.cleaned_data['password2']

                model = StudentList if is_student(role) else ProfessorList

                try:
                    user_obj = model.objects.get(number__iexact=username)
                except model.DoesNotExist:
                    return JsonResponse({'error': "کاربری با این شناسه وجود ندارد."}, status=400)

                major = user_obj.major
                email = user_obj.email
                name = user_obj.name

                if user_obj.pro:
                    role = role + 1

                code = str(random.randint(100000, 999999))
                request.session['temp_user'] = {
                    'username': username,
                    'password': password,
                    'role': role,
                    'code': code,
                    'major': major,
                    'email': email,
                    'name': name,
                }

                threading.Thread(target=send_verification_email, args=(code, email)).start()
                return JsonResponse({'success': "کد تایید به ایمیل شما ارسال شد."})

            return JsonResponse({'errors': form.errors}, status=400)

        #verify the user and create it on db
        elif action == 'signup':
            code1 = request.POST.get('code')
            code2 = request.session.get('temp_user', {}).get('code')

            if code1 == code2:
                user_model = get_user_model()
                temp_data = request.session.get('temp_user', {})

                user_model.objects.create_user(
                    username=temp_data.get('username'),
                    password=temp_data.get('password'),
                    role=temp_data.get('role'),
                    major=temp_data.get('major'),
                    full_name=temp_data.get('name'),
                    email=temp_data.get('email')
                )

                request.session.pop('temp_user', None)

                return JsonResponse({'success': "ثبت‌نام با موفقیت انجام شد."})

            return JsonResponse({'error': "کد تایید اشتباه است."}, status=400)
        
        elif action=='login':

            form=LoginForm(request.POST)

            if form.is_valid():
                
                username=form.cleaned_data['username']
                password=form.cleaned_data["password"]
                user=authenticate(request,username=username,password=password)
                if user:
                    login(request,user)
                    if user.role==3 or user.role==4:
                        messages.success(request, "وارد شدید")
                        return redirect('student_dashboard')
                    elif user.role==1:
                        messages.success(request, "وارد شدید")
                        return redirect('professor_dashboard')
                    elif user.role==2:
                        messages.success(request, "وارد شدید")
                        return redirect('faculty_dashboard')
                messages.error(request, "کاربر وجود ندارد")

                return render(request,"users/signup.html",context={"form":form})
            messages.error(request, " مقادیر نا معتبر هستند")
            return render (request,"users/signup.html",context={"form":form})

        return JsonResponse({'error': "درخواست نامعتبر."}, status=400)

#login    
'''@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):

    def get (self,request):

        form =LoginForm()
        return render(request,"users/signup.html",context={'form':form})
    
    def post(self,request):
        
        form=LoginForm(request.POST)

        if form.is_valid():
            
            username=form.cleaned_data['username']
            password=form.cleaned_data["password"]
            user=authenticate(request,username=username,password=password)
            if user:
                login(request,user)
                if user.role==3 or user.role==4:
                    messages.success(request, "وارد شدید")
                    return redirect('student_dashboard')
                elif user.role==1:
                    messages.success(request, "وارد شدید")
                    return redirect('professor_dashboard')
                else:
                    messages.success(request, "وارد شدید")
                    return redirect('faculty_dashboard')
            messages.error(request, "کاربر وجود ندارد")
            return render(request,"users/signup.html",context={"form":form})
        messages.error(request, " مقادیر نا معتبر هستند")
        return render (request,"users/signup.html",context={"form":form})'''
    
#logout
class LogoutView(LoginRequiredMixin,View):

    login_url = '/admin_login/'


    def post(self,request):

        logout(request)

        return render(request,'users/logout.html')

    
#create rest password link and email it for user
@method_decorator(csrf_exempt, name='dispatch')
class ResetPasswordView(View):

    def post(self,request):
        

        username=request.POST.get('number')

        try:
            user = CustomUser.objects.get(username__iexact=username)
        except user.DoesNotExist:
           return JsonResponse({"error": "کاربری با این شناسه وجود ندارد."}, status=404)
        email=user.email

        if not email:
            return JsonResponse({"error": "ایمیل بازیابی وجود ندارد"}, status=404)
        
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        
        reset_link = request.build_absolute_uri(
            reverse('my_password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
        )
        
        threading.Thread(target=send_verification_email, args=(reset_link, email)).start()

        return JsonResponse({"success":"رمز عبور برای شما ارسال شد."}, status=200)

#generate new password and save it
@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetConfirmView(View):

    def get (self,request,uidb64,token):

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            form = PasswordResetForm(user=user)
            return render(request, "users/password.html", {'form': form, 'uidb64': uidb64, 'token': token})
        else:
            messages.error(request, "لینک نامعتبر یا منقضی شده است")
            return redirect('login')

    def post (self,request, uidb64, token):

        
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None

        form =PasswordResetForm(user=user,data=request.POST)
        
        if user and default_token_generator.check_token(user, token):
            if form.is_valid():
                
                form.save()

                messages.success(request, "رمز با موفقیت تغییر کرد")
                return redirect('login')
            else:
                messages.error(request, "فرم نامعتبر است")
                return render(request, 'users\password.html', {
                'form': form,
                'uidb64': uidb64,
                'token': token,
                })
                
        
        messages.error(request, "لینک نامعتبر یا منقضی شده است")
        return redirect('login')

#login for admin
@method_decorator(csrf_exempt, name='dispatch')
class AdminLoginView(View):

    def get (self,request):

        form =AdminLoginForm()
        return render(request,"users/admin_login.html",context={'form':form})
    
    def post(self,request):
        
        form=AdminLoginForm(request.POST)
        if form.is_valid():
            
            username=form.cleaned_data['username']
            password=form.cleaned_data["password"]
            user=authenticate(request,username=username,password=password)
            if user and user.role==0:
                login(request,user)
                messages.success(request, "وارد شدید")
                return redirect('admin_dashboard')
            messages.error(request,"ادمینی با این نام کاربری وجود ندارد")
            return render(request,"users/admin_login.html",context={"form":form})
        messages.error(request, " مقادیر نا معتبر هستند")
        return render (request,"users/admin_login.html",context={"form":form})
    
#dashboards
#dashboard for admin
class AdminDashboardView(LoginRequiredMixin,UserPassesTestMixin,View):

    login_url = '/admin_login/'

    def test_func(self):
            
        return self.request.user.role==0

    def get (self,request):
       
        subject_list=Schedule.objects.all().values_list('subject',flat=True).distinct()
    
        full_name= request.user.full_name

        return render (request,"users/admin.html",context={"subject_list":subject_list,'full_name':full_name})
    
class StudentDashboardView(LoginRequiredMixin,UserPassesTestMixin,View):

    login_url = '/login/'

    def test_func(self):
            
        return self.request.user.role in [3, 4]

    def get (self,request):

        major=request.user.major
       
        subject_list=Schedule.objects.filter(major=major).values_list('subject',flat=True).distinct()

        full_name= request.user.full_name
        

        return render (request,"users/student.html",context={"subject_list":subject_list,'full_name':full_name,'major':major})

class ProfessorDashboardView(LoginRequiredMixin,UserPassesTestMixin,View):

    login_url = '/login/'

    def test_func(self):
            
        return self.request.user.role ==1

    def get (self,request):

        full_name= request.user.full_name

        professor_number=request.user.username
    
        return render (request,"users/professor.html",context={"professor_number":professor_number,'full_name':full_name})
    
class FacultyDashboardView(LoginRequiredMixin,UserPassesTestMixin,View):

    login_url = '/login/'

    def test_func(self):
            
        return self.request.user.role ==2

    def get (self,request):

        full_name= request.user.full_name

        professor_major=request.user.get_major_display()

        return render (request,"users/faculty.html",context={'full_name':full_name,'professor_major':professor_major})