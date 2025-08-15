from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.response import Response
from rest_framework import generics,status
from rest_framework.views import APIView

from .seializers import ProfessorSerializer
from ..models import ProfessorList,StudentList

@method_decorator(csrf_exempt, name='dispatch')  # برای تست
class SaveProfessorView(generics.GenericAPIView):
    serializer_class = ProfessorSerializer

    def get_object(self, pk):
        return get_object_or_404(ProfessorList, pk=pk)
    
    def get(self, request):
        professors = ProfessorList.objects.all()
        serializer = self.get_serializer(professors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        instance = self.get_object(pk)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        course = self.get_object(pk)
        course.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        if serializer.is_valid():
            serializer.save()  # اضافه کردن ذخیره‌سازی
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)