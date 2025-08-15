from django.urls import path
from .views import (SignupLoginView,ResetPasswordView,PasswordResetConfirmView,
                    AdminLoginView,AdminDashboardView,StudentDashboardView,
                    ProfessorDashboardView,LogoutView,FacultyDashboardView)
from .api.views import SaveProfessorView

urlpatterns = [
    path('signup_login/',SignupLoginView.as_view(),name='signup_login'),

    path('logout/',LogoutView.as_view(),name='logout'),
    path('admin_login/',AdminLoginView.as_view(),name='admin_login'),
    path('admin_dashboard/',AdminDashboardView.as_view(),name='admin_dashboard'),
    path('student/dashboard/',StudentDashboardView.as_view(),name='student_dashboard'),
    path('professor/dashboard/',ProfessorDashboardView.as_view(),name='professor_dashboard'),
    path('faculty/dashboard/',FacultyDashboardView.as_view(),name='faculty_dashboard'),
    path('login/reset_password/',ResetPasswordView.as_view(),name='reset_password'),
    path('password_reset_confirm/<uidb64>/<token>',PasswordResetConfirmView.as_view(),name='my_password_reset_confirm'),

    path('add_professors', SaveProfessorView.as_view(), name='add_professors'),
    path('update_professors/<int:pk>', SaveProfessorView.as_view(), name='update_professors'),
    path('load_professors', SaveProfessorView.as_view(), name='load_professors'),
    path('delete_professor/<int:pk>', SaveProfessorView.as_view(), name='delete_professor'),

]
