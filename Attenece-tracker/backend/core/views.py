from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Q
from .models import User, Student, Attendance
from .serializers import UserSerializer, StudentSerializer, AttendanceSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(role='teacher')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()] # Only Admin can manage teachers
        return super().get_permissions()

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Student.objects.filter(assigned_teacher=user)
        elif user.role == 'student':
            return Student.objects.filter(user=user)
        return Student.objects.all()

    def get_permissions(self):
         if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
         return super().get_permissions()

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Attendance.objects.all()
        if user.role == 'teacher':
             # Teachers see attendance for their students
             queryset = queryset.filter(student__assigned_teacher=user)
        elif user.role == 'student':
             # Students see only their own attendance
             queryset = queryset.filter(student__user=user)
        
        # Filter by date
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)
        return queryset

    def perform_create(self, serializer):
        serializer.save(marked_by=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_bulk(self, request):
        """
        Expects a list of attendance records:
        [{ "student": 1, "date": "2023-10-27", "status": "present" }, ...]
        """
        data = request.data
        if not isinstance(data, list):
            return Response({"error": "Expected a list of records"}, status=status.HTTP_400_BAD_REQUEST)
        
        created_records = []
        errors = []
        for item in data:
            item['marked_by'] = request.user.id
            serializer = self.get_serializer(data=item)
            if serializer.is_valid():
                # Check for existing record to update or create
                student = item.get('student')
                date = item.get('date')
                obj, created = Attendance.objects.update_or_create(
                    student_id=student, 
                    date=date, 
                    defaults={'status': item.get('status'), 'marked_by': request.user}
                )
                created_records.append(AttendanceSerializer(obj).data)
            else:
                errors.append(serializer.errors)
        
        if errors:
            return Response({"created": created_records, "errors": errors}, status=status.HTTP_207_MULTI_STATUS)
        return Response(created_records, status=status.HTTP_201_CREATED)

class ReportView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'teacher':
            students = Student.objects.filter(assigned_teacher=user)
        elif user.role == 'student':
            students = Student.objects.filter(user=user)
        else:
            students = Student.objects.all()

        report_data = []
        for student in students:
            total = Attendance.objects.filter(student=student).count()
            present = Attendance.objects.filter(student=student, status='present').count()
            absent = Attendance.objects.filter(student=student, status='absent').count()
            percentage = (present / total * 100) if total > 0 else 0
            
            report_data.append({
                "student": f"{student.name} ({student.roll_number})",
                "total_days": total,
                "present": present,
                "absent": absent,
                "percentage": round(percentage, 2)
            })
        
        return Response(report_data)

class DashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {}
        if user.role == 'admin':
            data['total_students'] = Student.objects.count()
            data['total_teachers'] = User.objects.filter(role='teacher').count()
            data['total_attendance_records'] = Attendance.objects.count()
        elif user.role == 'teacher':
            data['my_students'] = Student.objects.filter(assigned_teacher=user).count()
            data['total_marked'] = Attendance.objects.filter(marked_by=user).count()
        elif user.role == 'student':
            student_profile = getattr(user, 'student_profile', None)
            if student_profile:
                total = Attendance.objects.filter(student=student_profile).count()
                present = Attendance.objects.filter(student=student_profile, status='present').count()
                data['attendance_percentage'] = round((present / total * 100), 2) if total > 0 else 0
                data['total_days'] = total
        return Response(data)
