import sqlite3
import datetime
import jdatetime

class CSPSchedule:
    def __init__(self, professor_name, db_path="database.db"):
        self.professor_name = professor_name  # استاد جاری
        self.db_path = db_path
        self.days_of_week = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه"]
        self.schedule = []
        self.courses = {}
        self.professors = {}
        self.availability = {}
        self.load_data()

    def get_db_connection(self):
        return sqlite3.connect(self.db_path)

    def load_data(self):
        with self.get_db_connection() as conn:
            cur = conn.cursor()

            # فقط داده‌های همین استاد بر اساس فیلد submit
            cur.execute("SELECT subject, professor, major, year FROM schedule WHERE submit = ?", (self.professor_name,))
            self.schedule = cur.fetchall()
            print(f"✅ {len(self.schedule)} درس برای '{self.professor_name}' دریافت شد.")

            cur.execute("SELECT subject, days, length FROM courses")
            for subject, days, length in cur.fetchall():
                self.courses[subject] = {"days": days, "length": length}

            cur.execute("SELECT number, name FROM professors")
            for number, name in cur.fetchall():
                self.professors[str(number)] = name

            cur.execute("SELECT pronumber, day, start, end FROM availability")
            for pronumber, day, start, end in cur.fetchall():
                pronumber = str(pronumber)
                self.availability.setdefault(pronumber, {}).setdefault(day, []).append((start, end))

            print(f"✅ زمان آزاد برای {len(self.availability)} استاد بارگذاری شد.")

    def find_available_slot(self, pronumber, day, duration, schedule_map):
        slots = []
        for start, end in self.availability.get(pronumber, {}).get(day, []):
            time = max(start, 8.0)
            while time + duration <= end:
                overlaps = any(
                    s < time + duration and time < e
                    for s, e in schedule_map.get((pronumber, day), [])
                )
                if not overlaps:
                    slots.append(time)
                time += 0.5
        return slots

    def solve(self):
        final_schedule = []
        used = {}  # key = (prof, day) → list of (start, end)

        for subject, prof_number, major, year in self.schedule:
            prof_number = str(prof_number)
            prof_name = self.professors.get(prof_number, f"استاد {prof_number}")
            course_info = self.courses.get(subject)

            if not course_info:
                print(f"❌ درس '{subject}' در جدول courses تعریف نشده.")
                continue

            if prof_number not in self.availability:
                print(f"⚠️ برای استاد {prof_name} ({prof_number}) زمان آزادی ثبت نشده.")
                continue

            needed_days = course_info["days"]
            length = course_info["length"]
            available_days = list(self.availability[prof_number].keys())
            assigned = 0

            for day in sorted(available_days, key=lambda d: len(self.availability[prof_number][d])):
                if assigned >= needed_days:
                    break

                options = self.find_available_slot(prof_number, day, length, used)
                if options:
                    start = options[0]
                    end = start + length
                    final_schedule.append((subject, prof_number, major, year, day, start, end))
                    used.setdefault((prof_number, day), []).append((start, end))
                    print(f"✅ '{subject}' با استاد {prof_name} در {day} از {start} تا {end}")
                    assigned += 1
                else:
                    print(f"🚫 در {day} زمان آزاد برای '{subject}' با استاد {prof_name} پیدا نشد.")

            if assigned < needed_days:
                print(f"⚠️ فقط {assigned}/{needed_days} جلسه برای درس '{subject}' تنظیم شد.")

        self.save_to_database(final_schedule)

    def save_to_database(self, schedule):
        with self.get_db_connection() as conn:
            cur = conn.cursor()

            cur.execute("DELETE FROM schedule WHERE submit = ?", (self.professor_name,))

            for row in schedule:
                cur.execute('''
                    INSERT INTO schedule (subject, professor, major, year, day, start, end, submit)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', row + (self.professor_name,))
            conn.commit()

        print(f"📥 {len(schedule)} ردیف جدید برای '{self.professor_name}' ذخیره شد.")
    
    def solve_confliction(self):
        conn = self.get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT subject_one, subject_two, type, days FROM conflicts WHERE solve = 'درحال بررسی' AND type = 'درس'")
        conflicts = cursor.fetchall()

        if not conflicts:
            return []

        used = {}
        cursor.execute("SELECT id, subject, professor, major, year, day, start, end FROM schedule")
        schedule = cursor.fetchall()

        for row in schedule:
            _, _, prof, _, _, day, start, end = row
            prof = str(prof)
            used.setdefault((prof, day), []).append((start, end))

        schedule_by_subject = {}
        for row in schedule:
            subject = row[1]
            schedule_by_subject.setdefault(subject, []).append(row)

        suggestions = []

        for sub1, sub2, ctype, day in conflicts:
            key1, key2 = sorted([sub1, sub2])
            has_overlap = False

            for subject in [key1, key2]:
                if subject not in schedule_by_subject:
                    continue

                for entry in schedule_by_subject[subject]:
                    _, subj, prof, major, year, s_day, start, end = entry
                    if s_day != day:
                        continue

                    prof_str = str(prof)
                    length = end - start

                    available_slots = self.find_available_slot(prof_str, s_day, length, used)

                    valid_slots = [
                        t for t in available_slots
                        if not (start == t and end == t + length)
                    ]

                    if valid_slots:
                        time_ranges = [(t, t + length) for t in valid_slots]
                        time_ranges.sort()

                        merged_ranges = []
                        current_start, current_end = time_ranges[0]

                        for s, e in time_ranges[1:]:
                            if s <= current_end:  
                                current_end = max(current_end, e)
                            else:
                                merged_ranges.append((current_start, current_end))
                                current_start, current_end = s, e
                        merged_ranges.append((current_start, current_end))

                        readable_ranges = [
                            f"{int(s):02d}:{int((s % 1) * 60):02d}-{int(e):02d}:{int((e % 1) * 60):02d}"
                            for s, e in merged_ranges
                        ]

                        suggestions.append({
                            "conflict": f"{key1} و {key2}",
                            "conflict_type": ctype,
                            "changed_subject": subject,
                            "day": s_day,
                            "date": "-" if ctype == "درس" else "(تاریخ امتحان)",
                            "suggested_slots": readable_ranges
                        })
                        has_overlap = True
                        break

                if has_overlap:
                    break

            if not has_overlap:
                suggestions.append({
                    "conflict": f"{key1} و {key2}",
                    "conflict_type": ctype,
                    "changed_subject": None,
                    "day": None,
                    "date": None,
                    "suggested_slots": None
                })

        conn.close()
        return suggestions

class CSPExamination:
    def __init__(self, professor_name, db_path="database.db"):
        self.professor_name = professor_name
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self.slots = self.generate_exam_slots()
        self.examination = []

    def generate_exam_slots(self):
        today = datetime.date.today()
        slots = []
        offset = 0
        while len(slots) < 40:
            date = today + datetime.timedelta(days=offset)
            weekday_fa = jdatetime.date.fromgregorian(date=date).strftime("%A")
            if weekday_fa != "جمعه":
                slots.append((date, "09:00-11:00"))
                slots.append((date, "13:30-15:30"))
            offset += 1
        return slots

    def fetch_courses(self):
        self.cursor.execute("""
            SELECT DISTINCT subject, professor, major, year 
            FROM schedule 
            WHERE submit = ?
        """, (self.professor_name,))
        rows = self.cursor.fetchall()

        courses = []
        for subject, professor_id, major, year in rows:
            self.cursor.execute("SELECT name FROM professors WHERE number = ?", (professor_id,))
            prof_row = self.cursor.fetchone()
            professor_name = prof_row[0] if prof_row else "نامشخص"

            self.cursor.execute("SELECT type FROM courses WHERE subject = ? AND major = ?", (subject, major))
            result = self.cursor.fetchone()
            course_type = result[0] if result else "نامشخص"

            self.cursor.execute("""
                SELECT DISTINCT day FROM schedule
                WHERE subject = ? AND major = ? AND year = ?
            """, (subject, major, year))
            day_rows = self.cursor.fetchall()
            days = [row[0] for row in day_rows]

            courses.append({
                "subject": subject,
                "professor": professor_name,
                "major": major,
                "year": year,
                "type": course_type,
                "days": days
            })
        return courses

    def has_conflict(self, exams, date, time, year, major):
        for e in exams:
            if e["year"] == year and e["major"] == major and e["date"] == date:
                return True
        return False

    def has_spacing(self, exams, year, major, current_date):
        same_group = [e for e in exams if e["year"] == year and e["major"] == major]
        if not same_group:
            return True
        last_jalali = max([jdatetime.date(*map(int, e["date"].split("/"))) for e in same_group])
        last_gregorian = last_jalali.togregorian()
        return (current_date - last_gregorian).days >= 2

    def exams_on_day(self, exams, date):
        return [e for e in exams if e["date"] == date]

    def count_exams_on_day_time(self, exams, date, time):
        return sum(1 for e in exams if e["date"] == date and e["time"] == time)

    def schedule_exams(self):
        courses = self.fetch_courses()
        exams = []

        for course in courses:
            assigned = False
            is_public = course["type"] == "عمومی"
            print(f"\n📘 شروع زمان‌بندی برای درس: {course['subject']} ({'عمومی' if is_public else 'اختصاصی'})")

            for slot_date, slot_time in self.slots:
                WEEKDAY_FA = {
                    0: "دوشنبه",
                    1: "سه‌شنبه",
                    2: "چهارشنبه",
                    3: "پنج‌شنبه",
                    4: "جمعه",
                    5: "شنبه",
                    6: "یکشنبه"
                }

                slot_jalali = jdatetime.date.fromgregorian(date=slot_date)
                weekday_fa = WEEKDAY_FA[slot_date.weekday()]
                date_str = slot_jalali.strftime("%Y/%m/%d")

                print(f"⏳ بررسی در {weekday_fa} {slot_time}...")

                # دروس عمومی فقط پنج‌شنبه
                if is_public:
                    if weekday_fa != "پنج‌شنبه":
                        print("⛔ رد شد: درس عمومی ولی روز امتحان پنج‌شنبه نیست")
                        continue
                else:
                    if weekday_fa not in course["days"]:
                        print("⛔ رد شد: روز امتحان جزو روزهای کلاس نیست")
                        continue

                if self.has_conflict(exams, date_str, slot_time, course["year"], course["major"]):
                    print("⛔ رد شد: تداخل با امتحان دیگر")
                    continue

                if not self.has_spacing(exams, course["year"], course["major"], slot_date):
                    print("⛔ رد شد: فاصله با امتحان قبلی کم است")
                    continue

                if len(self.exams_on_day(exams, date_str)) >= 4:
                    print("⛔ رد شد: ظرفیت امتحانات روز پر شده")
                    continue

                if self.count_exams_on_day_time(exams, date_str, slot_time) >= 2:
                    print("⛔ رد شد: ظرفیت بازه زمانی پر شده")
                    continue

                exams.append({
                    "subject": course["subject"],
                    "type": course["type"],
                    "professor": course["professor"],
                    "major": course["major"],
                    "year": course["year"],
                    "date": date_str,
                    "time": slot_time
                })
                print(f"✅ زمان‌بندی موفق در {weekday_fa} {slot_time}")
                assigned = True
                break

            if not assigned:
                print(f"⚠️ امتحان '{course['subject']}' زمان‌بندی نشد.")

        self.examination = exams
        self.save_to_db()

        print(f"\n🎯 مجموع {len(exams)} از {len(courses)} امتحان با موفقیت زمان‌بندی شدند.")

    def save_to_db(self):
        self.cursor.execute("DELETE FROM examination WHERE submit = ?", (self.professor_name,))
        for e in self.examination:
            self.cursor.execute("""
                INSERT INTO examination (subject, type, professor, major, year, date, time, submit)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                e["subject"], e["type"], e["professor"],
                e["major"], e["year"], e["date"],
                e["time"], self.professor_name
            ))
        self.conn.commit()
        self.conn.close()
    
    def get_weekday_from_jalali(self, jalali_date):
        y, m, d = map(int, jalali_date.split('/'))
        return jdatetime.date(year=y, month=m, day=d).strftime('%A')\
            .replace("Saturday", "شنبه")\
            .replace("Sunday", "یکشنبه")\
            .replace("Monday", "دوشنبه")\
            .replace("Tuesday", "سه‌شنبه")\
            .replace("Wednesday", "چهارشنبه")\
            .replace("Thursday", "پنج‌شنبه")\
            .replace("Friday", "جمعه")

    def solve_confliction(self):
        conn = self.conn
        cursor = conn.cursor()

        cursor.execute("""
            SELECT subject_one, subject_two, type, days 
            FROM conflicts 
            WHERE solve = 'درحال بررسی' AND type = 'امتحان'
        """)
        conflicts = cursor.fetchall()

        if not conflicts:
            return []

        print(f"📦 تعداد تداخلات پیدا شده: {len(conflicts)}")

        cursor.execute("SELECT subject, date, time FROM examination WHERE submit = ?", (self.professor_name,))
        exams = cursor.fetchall()

        exams_by_subject = {}
        for subject, date, time in exams:
            exams_by_subject.setdefault(subject, []).append((date, time))

        suggestions = []

        for sub1, sub2, ctype, day in conflicts:
            key1, key2 = sorted([sub1, sub2])
            has_overlap = False
            suggested_slots = []
            changed_subject = None
            conflict_date = None
            conflict_time = None

            for subject in [key1, key2]:
                if subject not in exams_by_subject:
                    continue

                for date, time in exams_by_subject[subject]:
                    weekday = self.get_weekday_from_jalali(date)

                    if weekday != day:
                        continue

                    for other_subject in [key1, key2]:
                        if other_subject == subject:
                            continue
                        for o_date, o_time in exams_by_subject.get(other_subject, []):
                            if o_date == date and o_time == time:
                                has_overlap = True
                                changed_subject = subject
                                conflict_date = date
                                conflict_time = time

                    if has_overlap:
                        break
                if has_overlap:
                    break

            if not has_overlap:
                suggestions.append({
                    "conflict": f"{key1} و {key2}",
                    "conflict_type": ctype,
                    "changed_subject": None,
                    "day": None,
                    "date": None,
                    "suggested_slots": None
                })
                continue

            preferred_time_period = "morning" if conflict_time == "09:00-11:00" else "afternoon"
            weekday_blacklist = ["پنج‌شنبه", "جمعه"]

            for slot_date, slot_time in self.slots:
                slot_jdate_obj = jdatetime.date.fromgregorian(date=slot_date)
                slot_jdate = slot_jdate_obj.strftime('%Y/%m/%d')
                weekday = self.get_weekday_from_jalali(slot_jdate)

                if weekday in weekday_blacklist:
                    continue

                conflict_found = any(
                    exam_date == slot_jdate and exam_time == slot_time
                    for _, exam_entries in exams_by_subject.items()
                    for exam_date, exam_time in exam_entries
                )
                if conflict_found:
                    continue

                is_preferred = (
                    (preferred_time_period == "morning" and slot_time == "09:00-11:00") or
                    (preferred_time_period == "afternoon" and slot_time == "13:30-15:30")
                )

                suggested_slots.append((0 if is_preferred else 1, f"تاریخ {slot_jdate} ساعت {slot_time}"))

            suggested_slots.sort()
            final_suggestions = [slot for _, slot in suggested_slots[:5]]

            suggestions.append({
                "conflict": f"{key1} و {key2}",
                "conflict_type": ctype,
                "changed_subject": changed_subject,
                "day": self.get_weekday_from_jalali(conflict_date),
                "date": conflict_date,
                "suggested_slots": final_suggestions
            })

        return suggestions
