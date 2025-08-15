from django import forms
from django.contrib.auth.forms import UserCreationForm,SetPasswordForm,UserChangeForm

from .models import CustomUser

import re

class SignupForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ['username', 'password1', 'password2']

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if not re.fullmatch(r'\d+', username):
            raise forms.ValidationError("نام کاربری باید فقط شامل عدد باشد.")
        if CustomUser.objects.filter(username__iexact=username).exists():
            raise forms.ValidationError("کاربری با این نام کاربری قبلاً ثبت‌نام کرده است.")
        return username
        
    
    def clean_password2(self):
        password1=self.cleaned_data.get('password1')
        password2=self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("رمز عبور و تکرار آن مطابقت ندارند.")
        return password2
#forms for customuseradmin in admin.py     
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = '__all__'

    def clean(self):
        cleaned_data= super().clean()
        role=cleaned_data.get('role')
        email=cleaned_data.get('email')
        if role==0 and not email:
            self.add_error("email", "برای ادمین فیلد ایمیل الزامیست.")
        return cleaned_data

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = '__all__'

    def clean(self):
        cleaned_data= super().clean()
        role=cleaned_data.get('role')
        email=cleaned_data.get('email')
        if role==0 and not email:
            self.add_error("email", "برای ادمین فیلد ایمیل الزامیست.")
        return cleaned_data
#forms for views.py 
class SignupForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ['username', 'password1', 'password2']

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if not re.fullmatch(r'\d+', username):
            raise forms.ValidationError("نام کاربری باید فقط شامل عدد باشد.")
        if CustomUser.objects.filter(username__iexact=username).exists():
            raise forms.ValidationError("کاربری با این نام کاربری قبلاً ثبت‌نام کرده است.")
        return username
        
    
    def clean_password2(self):
        password1=self.cleaned_data.get('password1')
        password2=self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("رمز عبور و تکرار آن مطابقت ندارند.")
        return password2

class LoginForm(forms.Form):

    username=forms.IntegerField()
    password=forms.CharField()

class AdminLoginForm(forms.Form):

    username=forms.CharField()
    password=forms.CharField()


class PasswordResetForm(SetPasswordForm):
    class Meta:
        model = CustomUser
        fields = ['new_password1', 'new_password2']



