mongo --host localhost:27017 users --eval 'db.users.remove({"email": "ianmendez@gmail.com"})'
mongo --host localhost:27017 users --eval 'db.users.remove({"email": "juanlopez1@hotmail.com"})'