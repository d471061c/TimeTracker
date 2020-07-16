from os import urandom

from flask import jsonify
from flask_bcrypt import Bcrypt
from flask_jwt import JWT

from application import app
from ..models.account import Account

bcrypt = Bcrypt(app)

def authenticate(username, password):
    account = Account.query.filter_by(username=username).first()
    if account and bcrypt.check_password_hash(account.password, password):
        return account

def identity(payload):
    account_id = payload['identity']
    return Account.query.get(account_id)

def configure_jwt(app):
    app.config['SECRET_KEY'] = urandom(32)
    app.config['JWT_AUTH_URL_RULE'] = '/api/login'
    app.config['JWT_AUTH_HEADER_PREFIX'] = 'bearer'
    jwt = JWT(app, authenticate, identity)
    return jwt