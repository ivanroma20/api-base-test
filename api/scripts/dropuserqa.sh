mongo "mongodb+srv://cluster-core-qa-h5lgi.mongodb.net/users" --username culqi-qa --password '*******' --eval 'db.users.remove({"email": "ivanbeto@gmail.com"})'
mongo "mongodb+srv://cluster-core-qa-h5lgi.mongodb.net/accounts" --username culqi-qa --password '*******' --eval 'db.accounts.remove({"owner.email": "ivanbeto@gmail.com"}, {justOne: true})'
mongo "mongodb+srv://cluster-core-qa-h5lgi.mongodb.net/merchants" --username culqi-qa --password '*******' --eval 'db.merchants.remove({"owner.email": "ivanbeto@gmail.com"}, {justOne: true})'
