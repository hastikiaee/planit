from django.contrib import admin
from .models import Course, Availability, Schedule, Examination, Conflicts

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('subject', 'type', 'major', 'days', 'length')

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('professor', 'pronumber', 'day_of_week', 'start_time', 'end_time')

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('subject', 'professor', 'major', 'day_of_week', 'entry', 'start_time', 'end_time')

@admin.register(Examination)
class ExaminationAdmin(admin.ModelAdmin):
    list_display = ('subject', 'professor', 'major', 'entry', 'date', 'time')

@admin.register(Conflicts)
class ConflictsAdmin(admin.ModelAdmin):
    list_display = ('subject_one', 'subject_two', 'day_of_week', 'type', 'reporter', 'solve')

