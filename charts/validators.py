from django.core.exceptions import ValidationError


def validate_start_end_times(start_time,end_time):

    if start_time>end_time:
        raise ValidationError("End time must be after start time.")
    
    