from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.response import Response
from rest_framework import generics,status
from rest_framework.views import APIView
from rest_framework.permissions import DjangoModelPermissions

from .seializers import ProfessorSerializer,StudentSerializer
from ..models import ProfessorList,StudentList


#add delete edit load professorlist
#permissions = admin and professorpro(faculty) has ths perm => amin has higher perm level 
@method_decorator(csrf_exempt, name='dispatch')  # برای تست
class SaveProfessorView(generics.GenericAPIView):


    serializer_class = ProfessorSerializer
    permission_classes = [DjangoModelPermissions]
    queryset = ProfessorList.objects.all() 
    
    #فیلتر کردن کویری ست برای کاربر مدیر گروه
    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name="professorpro").exists():
            # فقط رکوردهای رشته خودش
            return self.queryset.filter(major=user.major)
        else:
            return self.queryset
        
    def get_object(self, pk):
        queryset=self.get_queryset()
        return get_object_or_404(queryset, pk=pk)
    
    def sanitize_professorpro_data(self, data):
        user = self.request.user
        if user.groups.filter(name="professorpro").exists():
            major = getattr(user, "major", None)
            if isinstance(data, list):
                for item in data:
                    item["major"] = major
                    item["pro"] = False
            else:
                data["major"] = major
                data["pro"] = False
        return data

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs and kwargs["data"] is not None:
            kwargs["data"] = self.sanitize_professorpro_data(kwargs["data"])

        serializer = super().get_serializer(*args, **kwargs)
        return serializer   # ✅ اضافه شد)
    
    def get(self, request):
        professors = self.get_queryset().all()
        serializer = self.get_serializer(professors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        instance = self.get_object(pk)
        self.check_object_permissions(request, instance)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        instance = self.get_object(pk)
        self.check_object_permissions(request, instance)
        instance.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        print(serializer.initial_data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()  # اضافه کردن ذخیره‌سازی
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@method_decorator(csrf_exempt, name='dispatch')  
class StudentView(generics.GenericAPIView):

    serializer_class = StudentSerializer
    permission_classes = [DjangoModelPermissions]
    queryset = StudentList.objects.all()

    def get_object(self, pk):
        queryset=self.get_queryset()
        return get_object_or_404(queryset, pk=pk)

    def get(self, request):
        students = self.get_queryset()
        serializer = self.get_serializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        instance = self.get_object(pk)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        instance = self.get_object(pk)
        instance.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        print(serializer.initial_data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()  # اضافه کردن ذخیره‌سازی
            return Response({"success": True}, status=status.HTTP_201_CREATED)