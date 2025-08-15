from rest_framework import serializers
from ..models import Course,Availability,Schedule,Examination,Conflicts

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model=Course
        fields='__all__'

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model=Availability
        fields='__all__'
        extra_kwargs = {
            'submitted_by': {'read_only': True}
        }

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Schedule
        fields='__all__'

class ExaminationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Examination
        fields='__all__'
    
class ConflictStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Conflicts
        fields='__all__'
        extra_kwargs = {
            'solve': {'read_only': True},
        }

class ConflictProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Conflicts
        fields='__all__'

class ConflictSerializer(serializers.ModelSerializer):
    class Meta:
        model=Conflicts
        fields='__all__'
        extra_kwargs = {
            'solve': {'read_only': True},
            'reporter': {'read_only': True},
        
        }
