from django.db import models
from django.utils.translation import gettext_lazy as _

from .validators import validate_start_end_times

# Create your models here.
class Course(models.Model):

    GENERAL=0
    REQUIRED=1
    CORE=2
    PRACTICAL=3
    ELECTIVE=4
    TYPES=((GENERAL,_('general')),(REQUIRED,_('required')),(CORE,_('core')),(PRACTICAL,_('practical')),(ELECTIVE,_('elective')))
    INDUSTRIAL=0
    COMPUTER=1
    PETROLEUM=2
    CHEMICAL=3
    MAJORS=((INDUSTRIAL,_('industrial')),(COMPUTER,_('computer')),(PETROLEUM,_('petroleum')),(CHEMICAL,_('chemical')))
    

    subject=models.CharField(_("subject"),blank=False,null=False)

    type=models.PositiveIntegerField(_('type'),blank=False,null=False,choices=TYPES)

    major=models.PositiveSmallIntegerField(_('major'),blank=False,null=False,choices=MAJORS)

    days=models.IntegerField(_('days'),blank=False,null=False)

    length=models.FloatField(_('length'),blank=False,null=False) 
    #CHOICE

    def get_major_display_label(self):
        return dict(self.MAJORS).get(self.major,_('not specified'))
    def get_type_display_label(self):
        return dict(self.TYPES).get(self.major,_('not specified'))
    

class Availability (models.Model):
    
    SAT=0
    SUN=1
    MON=2
    SAT=3
    TUE=4
    WED=5
    THU=6
    FRI=7
    
    WEEKDAYS=(
        (SUN,_('Sunday')),
        (MON,_('Monday')),
        (SAT,_('Saturday')),
        (TUE,_("Tuesday")),
        (WED,_("Wednesday")),
        (THU,_("Thursday")),
        (FRI,_('Friday')),
    )

    professor=models.CharField(_('professor'),blank=False,null=False)

    pronumber=models.IntegerField(_('professor number'),blank=False,null=False)

    day_of_week=models.PositiveIntegerField(_('day of week'),blank=False,null=False,choices=WEEKDAYS)

    start_time=models.FloatField(_('start'),blank=False,null=False)

    end_time=models.FloatField(_('start'),blank=False,null=False)

    submitted_by=models.TextField(_('submitted by'),blank=False,null=False)

    def clean(self):
        return super().clean()
        validate_start_end_times(self.start_time,self.end_time)
    
    


class Schedule(models.Model):

    SAT=0
    SUN=1
    MON=2
    SAT=3
    TUE=4
    WED=5
    THU=6
    FRI=7
    
    WEEKDAYS=(
        (SUN,_('Sunday')),
        (MON,_('Monday')),
        (SAT,_('Saturday')),
        (TUE,_("Tuesday")),
        (WED,_("Wednesday")),
        (THU,_("Thursday")),
        (FRI,_('Friday')),
    )

    GENERAL=0
    REQUIRED=1
    CORE=2
    PRACTICAL=3
    ELECTIVE=4
    TYPES=((GENERAL,_('general')),(REQUIRED,_('required')),(CORE,_('core')),(PRACTICAL,_('practical')),(ELECTIVE,_('elective')))

    INDUSTRIAL=0
    COMPUTER=1
    PETROLEUM=2
    CHEMICAL=3
    MAJORS=((INDUSTRIAL,_('industrial')),(COMPUTER,_('computer')),(PETROLEUM,_('petroleum')),(CHEMICAL,_('chemical')))

    FIRST=0
    SECOND=1
    THIRD=3
    FORTH=4
    ENTRY=[(FIRST,"ورودی اول "),(SECOND,'ورودی دوم'),(THIRD,'ورودی سوم'),(FORTH,'ورودی چهارم')]

    subject=models.CharField(_("subject"),blank=False,null=False)

    professor=models.CharField(_('professor'),blank=False,null=False)

    major=models.PositiveSmallIntegerField(_('major'),blank=False,null=False,choices=MAJORS)

    day_of_week=models.PositiveIntegerField(_('day of week'),blank=False,null=False,choices=WEEKDAYS)

    entry=models.IntegerField(_("year"),choices=ENTRY,blank=False,null=False)

    start_time=models.TimeField(_('start'),blank=False,null=False)

    end_time=models.TimeField(_('start'),blank=False,null=False)

    submitted_by=models.TextField(_('submitted by'),blank=False,null=False)

    def get_major_display_label(self):
        return dict(self.MAJORS).get(self.major,_('not specified'))
    def get_type_display_label(self):
        return dict(self.TYPES).get(self.type,_('not specified'))
    def get_day_of_week_display_label(self):
        return dict(self.WEEKDAYS).get(self.day_of_week,_('not specified'))
    

class Examination(models.Model):

    FIRST=0
    SECOND=1
    THIRD=3
    FORTH=4
    ENTRYS=[(FIRST,"ورودی اول "),(SECOND,'ورودی دوم'),(THIRD,'ورودی سوم'),(FORTH,'ورودی چهارم')]

    INDUSTRIAL=0
    COMPUTER=1
    PETROLEUM=2
    CHEMICAL=3
    MAJORS=((INDUSTRIAL,_('industrial')),(COMPUTER,_('computer')),(PETROLEUM,_('petroleum')),(CHEMICAL,_('chemical')))

    subject=models.CharField(_("subject"),blank=False,null=False)

    professor=models.CharField(_('professor'),blank=False,null=False)

    major=models.PositiveSmallIntegerField(_('major'),blank=False,null=False,choices=MAJORS)

    entry=models.IntegerField(_("year"),choices=ENTRYS,blank=False,null=False)

    date=models.DateField(_("date"), auto_now=False, auto_now_add=False,blank=False,null=False)

    time=models.TextField(_("time"),blank=False,null=False)

    submitted_by=models.TextField(_('submitted by'),blank=False,null=False)

    def get_major_display_label(self):
        return dict(self.MAJORS).get(self.major,_('not specified'))
    def get_entry_display_label(self):
        return dict(self.ENTRYS).get(self.entry,_('not specified'))

class Conflicts(models.Model):

    SAT=0
    SUN=1
    MON=2
    SAT=3
    TUE=4
    WED=5
    THU=6
    FRI=7
    
    WEEKDAYS=(
        (SUN,_('Sunday')),
        (MON,_('Monday')),
        (SAT,_('Saturday')),
        (TUE,_("Tuesday")),
        (WED,_("Wednesday")),
        (THU,_("Thursday")),
        (FRI,_('Friday')),
    )
     
    EXAM=0
    COURSE=1
    TYPES=((EXAM,_('exam')),
          (COURSE,_('course')))
    subject_one=models.CharField(_("subject"),blank=False,null=False)

    subject_two=models.CharField(_("subject"),blank=False,null=False)

    day_of_week=models.PositiveIntegerField(_('day of week'),blank=False,null=False,choices=WEEKDAYS)
  
    type=models.IntegerField(_('type'),blank=False,null=False,choices=TYPES)

    reporter=models.TextField(_("reporter"),blank=False,null=False)

    solve=models.CharField(_("solve"),blank=True,null=True)

    def save(self, *args, **kwargs):
        if self.subject_one > self.subject_two:
            self.subject_one, self.subject_two = self.subject_two, self.subject_one
        super().save(*args, **kwargs)

    def get_type_display_label(self):
        return dict(self.TYPES).get(self.type,_('not specified'))
    def get_day_of_week_display_label(self):
        return dict(self.WEEKDAYS).get(self.day_of_week,_('not specified'))
 


    
        









