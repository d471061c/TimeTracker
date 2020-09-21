from flask import jsonify, request, Blueprint
from flask_jwt import jwt_required, current_identity

from application import db
from ..models.task import Task
from ..models.progress import Progress

task_api = Blueprint('task_api', __name__)

@task_api.route("/api/task/<int:task_id>", methods=['GET', 'DELETE', 'PUT'])
@jwt_required()
def manage_task(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({ 'error' : 'no such task' })
    if task.project.owner_id != current_identity.id:
        return jsonify({ 'error' : 'access denied' })

    if request.method == 'DELETE':
        try:
            db.session().delete(task)
            db.session().commit()
        except Exception:
            return jsonify({ 'error' : 'failed to remove task'})
    elif request.method == 'PUT':
        content = request.get_json()
        if 'completed' in content.keys():
            task.completed = content['completed']
        if 'name' in content.keys():
            task.name = content['name']
        try:
            db.session().add(task)
            db.session().commit()
        except Exception:
            return jsonify({ 'error': 'failed to update task' })

    return jsonify(task.serialize())

@task_api.route("/api/task/<int:task_id>/start", methods=['POST'])
@jwt_required()
def start_task(task_id):
    # Find task
    task = Task.query.get(task_id)
    # Check access
    if not task:
        return jsonify({ 'error' : 'no such task' })
    if task.project.owner_id != current_identity.id:
        return jsonify({ 'error' : 'access denied' })
    # Check if the progress does not exist
    for progress in task.tracked_time:
        if progress.end_time == None:
            return jsonify({"error": "task already started"})
    # Create progress if it does not exist
    progress = Progress(task_id)
    # Add progress to task
    try:
        db.session().add(progress)
        db.session().commit()
    except Exception:
        return jsonify({"error": "failed to create progress"})
    return jsonify(task.serialize())

@task_api.route("/api/task/<int:task_id>/stop", methods=['POST'])
@jwt_required()
def stop_task(task_id):
    # Find task
    task = Task.query.get(task_id)
    # Check access
    if not task:
        return jsonify({ 'error' : 'no such task' })
    if task.project.owner_id != current_identity.id:
        return jsonify({ 'error' : 'access denied' })

    # End progress if the progress does not exist
    for progress in task.tracked_time:
        if progress.end_time == None:
            progress.stop()
            try:
                db.session().add(progress)
                db.session().commit()
            except Exception:
                return jsonify({"error": "failed to stop the progress"})
            return jsonify({"error": "task already started"})

    return jsonify(task.serialize())
