from flask import jsonify, request, Blueprint
from flask_jwt import jwt_required, current_identity

from application import db
from ..models.project import Project
from ..utils.validation import validate_json

project_api = Blueprint('project_api', __name__)

@project_api.route("/api/projects", methods=["GET"])
@jwt_required()
def projects():
    return jsonify([project.serialize() for project in current_identity.projects])

@project_api.route("/api/project", methods=["POST"])
@jwt_required()
def create_project():
    content = request.get_json()
    if not validate_json(content, {'name'}):
        return jsonify({"error": "project must have a name"})

    project = Project(current_identity.id, content['name'])
    try:
        db.session().add(project)
        db.session().commit()
    except Exception:
        return jsonify({"error": "failed to create project"})
    
    return jsonify(project.serialize())

@project_api.route("/api/project/<int:project_id>", methods=['GET', 'DELETE', 'PUT'])
@jwt_required()
def manage_project(project_id):
    project = Project.query.get(project_id)

    if not project:
        return jsonify({ 'error' : 'no such project' })
    if project.owner_id != current_identity.id:
        return jsonify({ 'error' : 'access denied' })
    
    if request.method == 'DELETE':
        try:
            db.session().delete(project)
            db.session().commit()
        except Exception as ex:
            return jsonify({ 'error': 'failed to remove project' })
    elif request.method == 'PUT':
        content = request.get_json()
        if not validate_json(content, {'name'}):
            return jsonify({'error' : 'invalid fields'})
        project.name = content['name']
        try:
            db.session().add(project)
            db.session().commit()
        except Exception:
            return jsonify({ 'error': 'failed to update project' })

    return jsonify(project.serialize())
