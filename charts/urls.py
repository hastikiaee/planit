from django.urls import path
from .api.views import SaveCoursesView,LoadCoursesView,SaveAvailabilityView,LoadAvailabilityView,SaveScheduleView,LoadScheduleView,CheckAvailabilityView
from .api.views import SaveExaminationView,LoadExaminationView,GnerateScheduleView,ShowExaminationView,ShowScheduleView
from .api.views import GnerateExaminationView,SolveScheduleConfliction,SolveExaminationConfliction,CheckConnfictStatusView,LoadConfilctsView

urlpatterns = [
    #course
    path('save_courses/',SaveCoursesView.as_view(),name='save_courses'),
    path('save_courses/<int:pk>',SaveCoursesView.as_view(),name='edit_courses'),
    path('load_courses/',LoadCoursesView.as_view(),name='load_courses'),
    #availability
    path('save_availability/',LoadAvailabilityView.as_view(),name='load_availability'),
    path('load_availibility/',SaveAvailabilityView.as_view(),name='save_availability'),
    path('load_availibility/<int:pk>',SaveAvailabilityView.as_view(),name='edit_availability'),
    path('check_availability/',CheckAvailabilityView.as_view(),name='check_availability'),
    #schedule
    path('save_schedule/',LoadScheduleView.as_view(),name='load_schedule'),
    path('save_schedule/',SaveScheduleView.as_view(),name='save_schedule'),
    path('load_schedule/<int:pk>',SaveScheduleView.as_view(),name='edit_schedule'),
    path("generate_schedule/",GnerateScheduleView.as_view(),name='generate_schedule'),
    path("show_schedule/",ShowScheduleView.as_view(),name='show_schedule'),
    path("solve_schedule_confliction/",SolveScheduleConfliction.as_view(),name='solve_schedule_confliction'),
    #exam
    path('save_examination/',LoadExaminationView.as_view(),name='load_examination'),
    path('save_examination/',SaveExaminationView.as_view(),name='save_examination'),
    path('load_examination/<int:pk>',SaveExaminationView.as_view(),name='edit_examination'),
    path('generate_examination/',GnerateExaminationView.as_view(),name='generate_examination'),
    path('show_examination/',ShowExaminationView.as_view(),name='show_examination'),
    path('solve_examination_confliction/',SolveExaminationConfliction.as_view(),name='solve_examination_confliction'),
    #conflicts
    path('check_conflict_status/',CheckConnfictStatusView.as_view(),name='check_conflict_status'),
    path('load_conflicts/',LoadConfilctsView.as_view(),name='load_conflicts'),

]

