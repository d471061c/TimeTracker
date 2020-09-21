from flask import jsonify, request, Blueprint
from flask_jwt import jwt_required, current_identity

from application import db
from ..models.project import Project
from ..models.task import Task
from ..utils.validation import validate_json

project_api = Blueprint('project_api', __name__)

@project_api.route("/api/projects", methods=["GET"])
@jwt_required()
def projects():
    return jsonify(Project.get_projects_by_owner(current_identity.id))

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

@project_api.route("/api/project/<int:project_id>/task", methods=['POST'])
@jwt_required()
def add_task(project_id):
    content = request.get_json()
    if not validate_json(content, {'name'}):
        return jsonify({"error": "task must have a name"})
    task = Task(content['name'], project_id)
    try:
        db.session().add(task)
        db.session().commit()
    except Exception:
        return jsonify({"error": "failed to create task"})
    return jsonify(task.serialize())


@project_api.route("/api/project/<int:project_id>", methods=['GET'])
@jwt_required()
def get_project_by_id(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({ 'error' : 'no such project' })
    if project.owner_id != current_identity.id:
        return jsonify({ 'error' : 'access denied' })

    return jsonify(project.get_task_list())

@project_api.route("/api/project/<int:project_id>", methods=['DELETE', 'PUT'])
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
        except Exception:
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
