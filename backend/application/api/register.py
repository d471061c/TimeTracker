from application import db
from ..models.account import Account
from ..config.security import bcrypt
from ..utils.validation import validate_json

from flask import jsonify, request, Blueprint
from flask_jwt import jwt_required, current_identity

register_api = Blueprint('registration_api', __name__)

@register_api.route("/api/register", methods=["POST"])
def register():
    credentials = request.get_json()
    if not validate_json(credentials, {'name', 'username', 'password'}):
        return jsonify({ 'error' : 'bad credentials'}), 403
    try:
        account = Account(credentials['name'], 
                          credentials['username'], 
                          bcrypt.generate_password_hash(credentials['password']))
        db.session().add(account)
        db.session().commit()
    except Exception:
        return jsonify({ 'error' : 'failed to register'}), 403
    return jsonify({'status': 'ok'}), 200