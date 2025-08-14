cd ..
mkdir back
cd back
python3 -m venv venv
source venv/bin/activate

pip install django pillow
pip install djangorestframework
pip install django-cors-headers
pip install --upgrade djangorestframework-simplejwt
pip install psycopg2-binary


django-admin startproject django_settings .
django-admin startapp django_app

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
