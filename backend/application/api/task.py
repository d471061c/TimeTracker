from flask import jsonify, request, Blueprint
from flask_jwt import jwt_required, current_identity

from application import db
from ..models.task import Task
from ..models.progress import Progress

task_api = Blueprint('task_api', __name__)

def verify_access(task):
    """Verify access to task

    Args:
        task (Task): task to check access to

    Returns:
        [Boolean, String]: Tuple containing access and related message
    """
    if not task:
        return (False, 'No such task')
    if task.project.owner_id != current_identity.id:
        return (False, 'Access denied')
    return (True, 'ok')

@task_api.route("/api/task/<int:task_id>", methods=['GET'])
@jwt_required()
def get_task(task_id):
    task = Task.query.get(task_id)
    access, message = verify_access(task)
    if not access: return jsonify({'error': message})
    return jsonify(task.serialize())

@task_api.route("/api/task/<int:task_id>", methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    task = Task.query.get(task_id)
    access, message = verify_access(task)
    if not access: return jsonify({'error': message})
    # Delete task
    deleted = task.delete()
    if not deleted:
        return jsonify({'error' : 'failed to delete task'})
    return jsonify(task.serialize())

@task_api.route("/api/task/<int:task_id>", methods=['PUT'])
@jwt_required()
def update_task(task_id):
    task = Task.query.get(task_id)
    access, message = verify_access(task)
    if not access: return jsonify({'error': message})
    # Update task's content
    content = request.get_json()
    if 'name' in content.keys():
        task.name = content['name']
    updated = task.update()
    if not updated:
        return jsonify({ 'error': 'failed to update task'})
    return jsonify(task.serialize())

@task_api.route("/api/task/<int:task_id>/start", methods=['POST'])
@jwt_required()
def start_task(task_id):
    task = Task.query.get(task_id)
    access, message = verify_access(task)
    if not access: return jsonify({'error': message})
    # Start the task only if the task is not started or it is paused
    saved = task.start()
    if not saved: 
        return jsonify({ 'error' : 'failed to start task'})
    return jsonify(task.serialize())

@task_api.route("/api/task/<int:task_id>/complete", methods=['POST'])
@jwt_required()
def complete_task(task_id):
    task = Task.query.get(task_id)
    access, message = verify_access(task)
    if not access: return jsonify({'error': message})
    # Complete task in all the scenarios
    saved = task.complete()
    if not saved:
        return jsonify({ 'error' : 'failed to complete task'})
    return jsonify(task.serialize())

@task_api.route("/api/task/<int:task_id>/reset", methods=['POST'])
@jwt_required()
def reset_task(task_id):
    task = Task.query.get(task_id)
    access, message = verify_access(task)
    if not access: return jsonify({'error': message})
    # Reset the task only if the task is completed
    saved = task.reset()
    if not saved:
        return jsonify({ 'error' : 'failed to reset task'})
    return jsonify(task.serialize())

@task_api.route("/api/task/<int:task_id>/pause", methods=['POST'])
@jwt_required()
def pause_task(task_id):
    task = Task.query.get(task_id)
    access, message = verify_access(task)
    if not access: return jsonify({'error': message})
    # Pause the task only if it is started
    saved = task.pause()
    if not saved:
        return jsonify({ 'error' : 'failed to complete task'})
    return jsonify(task.serialize())