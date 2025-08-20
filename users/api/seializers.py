from rest_framework import serializers
from ..models import ProfessorList,StudentList

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProfessorList
        fields='__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model=StudentList
        fields='__all__'