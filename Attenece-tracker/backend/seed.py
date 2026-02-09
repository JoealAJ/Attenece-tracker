import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import User, Student

def seed():
    # Create Admin
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123', role='admin')
        print("Superuser 'admin' created.")

    # Create Teacher
    if not User.objects.filter(username='teacher1').exists():
        teacher = User.objects.create_user('teacher1', 'teacher1@example.com', 'teacher123', role='teacher', first_name='John', last_name='Doe')
        print("Teacher 'teacher1' created.")
    else:
        teacher = User.objects.get(username='teacher1')

    # Create Students
    students_data = [
        {'name': 'Alice Smith', 'roll_number': 'S001', 'email': 'alice@example.com'},
        {'name': 'Bob Johnson', 'roll_number': 'S002', 'email': 'bob@example.com'},
    ]

    for data in students_data:
        if not Student.objects.filter(roll_number=data['roll_number']).exists():
            Student.objects.create(assigned_teacher=teacher, **data)
            print(f"Student {data['name']} created.")

if __name__ == '__main__':
    seed()
