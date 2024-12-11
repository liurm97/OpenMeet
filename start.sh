#1 create virtual env
python3 -m venv env

#2
pip install --upgrade pip

#3
pip install -r ./requirements.txt

#4 - create django project named `backend`
django-admin startproject backend

#5 - start app named `api`
python manage.py startapp api

#6 - create migration
python manage.py makemigrations

#7 - view migration created in SQL
python manage.py sqlmigrate {name_of_app} {migration_file}
# python manage.py sqlmigrate api 0001_initial

#8 - Migrate
python manage.py migrate

#9 - start server
python manage.py runserver
