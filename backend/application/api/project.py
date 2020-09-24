from flask import jsonify, request, Blueprint
from flask_jwt import jwt_required, current_identity

from application import db
from ..models.project import Project
from ..models.task import Task
from ..utils.validation import validate_json

project_api = Blueprint('project_api', __name__)

def verify_access(project):
    """verify access to project

    Args:
        project (Project): project to verify access to

    Returns:
        Boolean: True, if the access is granted
    """
    if not project:
        return (False, 'no such project')
    if project.owner_id != current_identity.id:
        return (False, 'access denied')
    return (True, 'ok')

@project_api.route("/api/projects", methods=["GET"])
@jwt_required()
def projects():
    return jsonify(Project.get_projects_by_owner(current_identity.id))

@project_api.route("/api/project", methods=["POST"])
@jwt_required()
def create_project():
    content = request.get_json()
    if not validate_json(content, {'name'}) or len(content["name"].strip()) == 0:
        return jsonify({"error": "project must have a name"}), 400

    project = Project(current_identity.id, content['name'])
    try:
        db.session().add(project)
        db.session().commit()
    except Exception:
        return jsonify({"error": "failed to create project"}), 400
    
    return jsonify(project.serialize())

@project_api.route("/api/project/<int:project_id>/task", methods=['POST'])
@jwt_required()
def add_task(project_id):
    content = request.get_json()
    if not validate_json(content, {'name'}) or len(content["name"].strip()) == 0:
        return jsonify({"error": "task must have a name"}), 400
    project = Project.query.get(project_id)
    access, message = verify_access(project)
    if not access: return jsonify({'error': message}), 400

    task = Task(content['name'], project_id)
    try:
        db.session().add(task)
        db.session().commit()
    except Exception:
        return jsonify({"error": "failed to create task"}), 400
    return jsonify(task.serialize())


@project_api.route("/api/project/<int:project_id>", methods=['GET'])
@jwt_required()
def get_project_by_id(project_id):
    project = Project.query.get(project_id)
    access, message = verify_access(project)
    if not access: return jsonify({'error': message}), 400

    return jsonify(project.get_task_list())

@project_api.route("/api/project/<int:project_id>", methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    project = Project.query.get(project_id)
    access, message = verify_access(project)
    if not access: return jsonify({'error': message}), 400
    deleted = project.delete()
    if not deleted:
        return jsonify({ 'error': 'failed to remove project' }), 400
    return jsonify(project.serialize())

@project_api.route("/api/project/<int:project_id>", methods=['PUT'])
@jwt_required()
def manage_project(project_id):
    project = Project.query.get(project_id)
    access, message = verify_access(project)
    if not access: return jsonify({'error': message}), 400
    
    content = request.get_json()
    if not validate_json(content, {'name'}):
        return jsonify({'error' : 'invalid fields'}), 400
    project.name = content['name']
    try:
        db.session().add(project)
        db.session().commit()
    except Exception:
        return jsonify({ 'error': 'failed to update project' }), 400

    return jsonify(project.serialize())
