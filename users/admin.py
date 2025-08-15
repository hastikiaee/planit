from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import StudentList,ProfessorList,CustomUser
from .forms import CustomUserChangeForm,CustomUserCreationForm
from django.utils.translation import gettext_lazy as _

# Register your models here.
@admin.register(StudentList)
class StudentListAdmin(admin.ModelAdmin):
    list_display=['name','major']
    list_filter=['major','entry','pro']

@admin.register(ProfessorList)
class ProfessorListAdmin(admin.ModelAdmin):
    list_display=['name','major']
    list_filter=['major','pro']

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):

    form=CustomUserChangeForm
    add_form=CustomUserCreationForm

    list_display = ('username', 'role', 'major', 'is_staff', 'is_superuser')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('اطلاعات شخصی', {'fields': ('role', 'major','email','full_name')}),
        ('دسترسی‌ها', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('تاریخ‌ها', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'role', 'major', 'password1', 'password2', 'is_staff', 'is_active','email','full_name')
        }),
    )

    search_fields = ('username', 'role', 'major')
    list_filter = ('role', 'major', 'is_staff')
    readonly_fields = ('last_login',)