from rest_framework import serializers
from ..models import ProfessorList,StudentList

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProfessorList
        fields='__all__'