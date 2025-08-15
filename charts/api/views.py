from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.response import Response
from rest_framework import generics,status
from rest_framework.views import APIView

from .serializers import CourseSerializer,AvailabilitySerializer,ScheduleSerializer,ExaminationSerializer
from .serializers import ConflictStudentSerializer,ConflictProfessorSerializer,ConflictSerializer
from ..models import Course,Availability,Schedule,Examination,Conflicts
from ..chartmanager import CSPSchedule,CSPExamination 

#بخش دروس    
# save new cours & delete course by id & update by id
class SaveCoursesView(generics.GenericAPIView):
    serializer_class = CourseSerializer  

    def get_object(self,pk):
        return get_object_or_404(Course,pk=pk)
       

    def patch (self,request,pk):

        instance=self.get_object(pk)
        
        serializer = self.get_serializer(instance,data=request.data,partial=True)
   
        if serializer.is_valid():
          
            serializer.save()
            
            return Response({"success": True}, status=status.HTTP_201_CREATED)
  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):
        
        course = self.get_object(pk)
        course.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
    
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)

        if serializer.is_valid():
            
            return Response({"success": True}, status=status.HTTP_201_CREATED)
       
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#load list of courses    
class LoadCoursesView(generics.ListAPIView):

    serializer_class = CourseSerializer

    queryset = Course.objects.all()


#بخش زمان ازاد اساتید
# save new availability & delete availability by id & update by id
class SaveAvailabilityView(generics.GenericAPIView):

    serializer_class = AvailabilitySerializer 

    def get_object(self,pk):

        return get_object_or_404(Availability,pk=pk)

             

       
    
    def patch (self,request,pk):

        instance=self.get_object(pk)
        
        serializer = self.get_serializer(instance,data=request.data,partial=True)
       
        if serializer.is_valid():
           
            serializer.save()
           
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):

        availability = self.get_object(pk)
        availability.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)
    #save availabilty in database for the person who submitted
    def post(self, request):
        
        submitted_by=request.data.get('submittedby')

        data_list=request.data.get('data')

        if not isinstance(data_list,list):

            return Response({"error": "your data must be a list"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data_list, many=True)

        if submitted_by:
            if serializer.is_valid():
            
                serializer.save(submitted_by=submitted_by)
            
                return Response({"success": True}, status=status.HTTP_201_CREATED)
       
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
             return Response({"error": "submittedby is required"}, status=status.HTTP_400_BAD_REQUEST)


#load availability list for each professor who submit availability
class LoadAvailabilityView(generics.GenericAPIView):

    def post(self,request):

        submitted_by=request.data.get("professor_name")

        if not submitted_by:
             return Response({"error": "submitted_by is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        availability=Availability.objects.filter(submitted_by__iexact=submitted_by)

        serializer=AvailabilitySerializer(availability,many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CheckAvailabilityView(APIView):
     
    def post(self,request):

        professor_name=request.data.get("professor_name")

        if not professor_name:
             return Response({"error": "professor name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        exist=Availability.objects.filter(submitted_by__iexact=professor_name).exists()

        return Response({"isempty":not exist},status=status.HTTP_200_OK)
    

#بخش برنامه کلاسی
#دخیره دروسی که باید برنامه ریزی بشه بدون تایم شروع و پایان
class SaveScheduleView(generics.GenericAPIView):

    serializer_class = ScheduleSerializer  
    def get_object(self,pk):

        return get_object_or_404(Schedule,pk=pk)
       

    def patch (self,request,pk):

        instance=self.get_object(pk)
        
        serializer = self.get_serializer(instance,data=request.data,partial=True)
        # اعتبارسنجی داده‌ها
        if serializer.is_valid():
         
            serializer.save()
         
            return Response({"success": True}, status=status.HTTP_201_CREATED)
   
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):

        schedule = self.get_object(pk)
        schedule.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)

    def post(self, request):

        submitted_by=request.data.get('professor_name')

        data_list=request.data.get('schedule')

        if not isinstance(data_list,list):

            return Response({"error": "your data must be a list"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data_list, many=True)

        if submitted_by:

            if serializer.is_valid():
            
                serializer.save(submitted_by=submitted_by)
            
                return Response({"success": True}, status=status.HTTP_201_CREATED)
       
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
             return Response({"error": "professor name is required"}, status=status.HTTP_400_BAD_REQUEST)


#load schdule for the person who submit
class LoadScheduleView(generics.GenericAPIView):
    
    serializer_class = ScheduleSerializer
    def post(self,request):
 
        professor_name=request.data.get("professor_name")
        if professor_name:
            queryset = Schedule.objects.filter(submitted_by__iexact=professor_name)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "professor name is required"}, status=status.HTTP_400_BAD_REQUEST)   

#ساخت برنامه درسی با توجه به دیتای اولیه از مدل برنامه و ذخیره مجدد در دیتا بیس   
class GnerateScheduleView(generics.GenericAPIView):

    def post(self, request):

        professor_name=request.data.get("professor_name")

        if not professor_name:
             
             return Response({"error": "professor name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        else:

            try:
                scheduler = CSPSchedule(professor_name)

                scheduler.solve()

                return Response({ "success": True,"message": "برنامه‌ریزی درسی با موفقیت انجام شد!"})
            
            except Exception as e:

                return Response({"success": False,"message": f"خطا در ساخت برنامه: {str(e)}"},
                                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
#show all schedules
class ShowScheduleView(generics.ListAPIView):

    serializer_class=ScheduleSerializer
    queryset=Schedule.objects.all()

#گرفتن برنامه درسی بررسی تداخلات و پیشنهاد برای رفع ان
class SolveScheduleConfliction(generics.GenericAPIView):

    serializer_class=ScheduleSerializer

    def post(self,request):
        professor_name=request.data.get('professor_name')
        if not professor_name:
            return Response({"error": "professor name is required"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:

                Scheduler=CSPSchedule('professor_name')
                suggestions=Scheduler.solve_confliction()
                serializer=self.get_serializer(suggestions, many=True)
                return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)
            
            except Exception as e:

                return Response({"success": False,"message": f"خطا در ساخت برنامه: {str(e)}"},
                                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    

#بخش امتحانا
#دخیره اولیه امتحان ها بدون تاریخ برگذاری
class SaveExaminationView(generics.GenericAPIView):

    serializer_class = ExaminationSerializer  

    def get_object(self,pk):

        return get_object_or_404(Examination, pk=pk)
       
    
    def patch (self,request,pk):

        instance=self.get_object(pk)
        
        serializer = self.get_serializer(instance,data=request.data,partial=True)
        # اعتبارسنجی داده‌ها
        if serializer.is_valid():
            # ذخیره داده‌ها در دیتابیس
            serializer.save()
            # بازگرداندن پاسخ موفقیت‌آمیز با کد HTTP 201 (ساخته شد)
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        # اگر داده‌ها نامعتبر بودند، ارورها را با کد HTTP 400 (درخواست نامعتبر) برمی‌گرداند
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):

        examination = self.get_object(pk)
        examination.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
           

        submitted_by=request.data.get('professor_name')

        data_list=request.data.get('examination')

        if not isinstance(data_list,list):

            return Response({"error": "your data must be a list"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data_list, many=True)

        if submitted_by:
            if serializer.is_valid():
            
                serializer.save(submitted_by=submitted_by)
            
                return Response({"success": True}, status=status.HTTP_201_CREATED)
       
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
             return Response({"error": "professor name is required"}, status=status.HTTP_400_BAD_REQUEST)


#load examination for who submit
class LoadExaminationView(generics.GenericAPIView):

    serializer_class = ScheduleSerializer
    def post(self,request):
 
        professor_name=request.data.get("professor_name")

        if professor_name:

            queryset = Schedule.objects.filter(submitted_by__iexact=professor_name)

            serializer = self.get_serializer(queryset, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "professor name is required"}, status=status.HTTP_400_BAD_REQUEST) 

#ساخت برنامه امتحانی با استفاده از دیتای اولیه و ذخیره در دیتا بیس
class GnerateExaminationView(generics.GenericAPIView):

    def post(self, request):

        professor_name=request.data.get("professor_name")

        if not professor_name:
             
             return Response({"error": "professor name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            
            try:

                examination = CSPExamination(professor_name)
                examination.schedule_exams()
                return Response({ "success": True,"message": "برنامه‌ریزی امتحانی با موفقیت انجام شد!"})
            
            except Exception as e:

                return Response({"success": False,"message": f"خطا در ساخت برنامه: {str(e)}"},
                                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#show all exams
class ShowExaminationView(generics.ListAPIView):

    serializer_class=ScheduleSerializer
    queryset=Schedule.objects.all()

# گرفتن برنامه امتحانی از دیتا بیس بررسی تداخلات پیشنهاد برای رفع
class SolveExaminationConfliction(generics.GenericAPIView):

    serializer_class=ExaminationSerializer

    def post(self,request):
        professor_name=request.data.get('professor_name')
        if not professor_name:
            return Response({"error": "professor name is required"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:

                examination=CSPSchedule('professor_name')
                suggestions=examination.solve_confliction()
                serializer=self.get_serializer(suggestions,many=True)
                return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)
            
            except:

                return Response({"success": False,"message": f"خطا در ساخت برنامه"},
                                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

#بخش تداخلات

class SaveConflictsView(generics.GenericAPIView):

    def get_serializer_class(self,user_type):
        if user_type=='professor':
            return ConflictProfessorSerializer
        elif user_type=='student':
            return ConflictStudentSerializer

    
    def get_object(self, pk):
        return get_object_or_404(Conflicts, pk=pk)
    
    
    def delete(self,request,pk):
    
        conflict=self.get_object(pk)
        conflict.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)

    
    def post(self,request):
        '''
            
           
        
        '''
        user_type = request.session.get('user_type')
        '''reporter = request.data.get('reporter')''' 
        data=request.data.get()

        if not user_type:
            return Response({"error": "user type is required"}, status=status.HTTP_400_BAD_REQUEST)
        else:
                
                serializer_class = self.get_serializer_class(user_type)
                serializer=serializer_class(data=data,many=True)
                if serializer.is_valid():
                    try:
                        serializer.save()
                        return Response({"success": True}, status=status.HTTP_201_CREATED)
                    except:
                        return Response({"success": False,"message": f"خطا در ساخت برنامه"},
                                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoadConfilctsView(generics.GenericAPIView):

    serializer_class=ConflictProfessorSerializer

    def get (self,request):

        user_type = request.session.get('user_type')
        user_name= request.session.get('user_name')
        if not user_type or not user_name:
            return Response({"error": "user type and user name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if user_type in ['student', 'admin']:
            data = Conflicts.objects.filter(reporter__iexact=user_name)
        elif user_type == 'professor':
            data = Conflicts.objects.all()
        else:
            return Response({"error": "Invalid user type"}, status=status.HTTP_400_BAD_REQUEST)

        serializer=self.get_serializer(data,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CheckConnfictStatusView(generics.GenericAPIView):

    serializer_class=ConflictSerializer

    def post(self,request):
        data=request.data
        serializer=self.serializer_class(data=data)
        if serializer.is_valid():

            s1 = serializer.validated_data['subject_one']
            s2 = serializer.validated_data['subject_two']
            t  = serializer.validated_data['type']
            d  = serializer.validated_data['day_of_week']
            if s1 >s2:
                s1, s2 = s2, s1
            conflicts=Conflicts.objects.filter(Q(subject_one__iexact=s1)&Q(subject_two__iexact=s2)
                                               &Q(type=t)&Q(day_of_week=d)).first()
            
            if conflicts:
                return Response({'status':conflicts.solve})
            else:
                return Response({'status': 0})
        else:
            return Response(serializer.errors, status=400)

            





