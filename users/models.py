from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils.translation import gettext_lazy as _
# Create your models here.

class CustomUserManager(BaseUserManager):

    def create_user(self,username,password=None, **extra_fields):

        major=extra_fields.pop('major',None)
        role=extra_fields.pop('role',None)
        if not username:
            raise ValueError("username needed")
        if not password:
            raise ValueError("password is needed")
        if not extra_fields.get('is_superuser', False):
            if not role:
                raise ValueError("role is needed")
    
        user=self.model(username=username,role=role, major=major,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username , password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', CustomUser.ADMIN)
        extra_fields.setdefault('major', CustomUser.COMPUTER)
  
        
        return self.create_user(username, password, **extra_fields)

class CustomUser(AbstractBaseUser,PermissionsMixin):

    ADMIN=0
    PROFESSOR=1
    PROFESSORPRO=2
    STUDENT=3
    STUDENTPRO=4
    ROLE=((ADMIN,"ادمین"),(PROFESSOR,"استاد"),
          (PROFESSORPRO,'استاد مدیر گروه'),(STUDENT,'دانشجو'),(STUDENTPRO,'نماینده'))
    role=models.IntegerField(_("role"),choices=ROLE)
    

    INDUSTRIAL=0
    COMPUTER=1
    PETROLEUM=2
    CHEMICAL=3
    MAJORS=((INDUSTRIAL,_('industrial')),(COMPUTER,_('computer')),
            (PETROLEUM,_('petroleum')),(CHEMICAL,_('chemical')))
    
    major=models.IntegerField(_('major'),choices=MAJORS,blank=True,null=True)

    username=models.CharField(_("username"),unique=True,max_length=30)

    full_name=models.CharField(_('full name'),blank=True,null=True,max_length=30)

    email = models.EmailField(_('email'),blank=True,null=True)

    date_joined = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects=CustomUserManager()

    def __str__(self):
        return self.full_name or self.username or ""


class StudentList(models.Model):

    name = models.CharField(max_length=100)
    number = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    pro=models.BooleanField(blank=False,null=False)

    FIRST=0
    SECOND=1
    THIRD=2
    FORTH=3
    ENTRY=[(FIRST,"ورودی اول "),(SECOND,'ورودی دوم'),(THIRD,'ورودی سوم'),(FORTH,'ورودی چهارم')]
    entry=models.IntegerField(_("year"),choices=ENTRY,blank=False,null=False)

    INDUSTRIAL=0
    COMPUTER=1
    PETROLEUM=2
    CHEMICAL=3
    MAJORS=((INDUSTRIAL,_('industrial')),(COMPUTER,_('computer')),
            (PETROLEUM,_('petroleum')),(CHEMICAL,_('chemical')))
    
    major=models.IntegerField(_('major'),choices=MAJORS)

    def __str__(self):
        return f"{self.name} ({self.number})"
    def get_major_display_label(self):
        return dict(self.MAJORS).get(self.major,_('not specified'))
    def get_entry_display_label(self):
        return dict(self.ENTRYS).get(self.entry,_('not specified'))



class ProfessorList(models.Model):

    name = models.CharField(max_length=100,blank=False,null=False)
    number = models.CharField(max_length=20, unique=True,blank=False,null=False)
    email = models.EmailField(unique=True)
    pro=models.BooleanField(blank=False,null=False)

    INDUSTRIAL=0
    COMPUTER=1
    PETROLEUM=2
    CHEMICAL=3
    MAJORS=((INDUSTRIAL,_('industrial')),(COMPUTER,_('computer')),
            (PETROLEUM,_('petroleum')),(CHEMICAL,_('chemical')))
    
    major=models.IntegerField(_('major'),choices=MAJORS)

    def __str__(self):
        return f"{self.name} ({self.number})"
    
    def get_major_display_label(self):
        return dict(self.MAJORS).get(self.major,_('not specified'))