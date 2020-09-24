from enum import Enum

from application import db
from .basemodel import TrackedModel
from .progress import Progress

SPENT_TIME_QUERY = """
SELECT 
  SUM(
    case when end_time is not null then ROUND(
      EXTRACT(
        EPOCH 
        FROM 
          progress.end_time - progress.start_time
      )
    ) else 0 end
  ) as time_spent 
FROM 
  progress 
WHERE 
  task_id = :task_id
"""

STARTED_PROGRESS_QUERY = """
SELECT 
  id 
FROM 
  progress 
WHERE 
  task_id = :task_id 
  AND start_time IS NOT NULL 
  AND end_time IS NULL
"""

DELETE_ALL_PROGRESS = "DELETE FROM progress WHERE progress.task_id=:task_id"

class State(Enum):
    not_started = 'not_started'
    started = 'started'
    paused = 'paused'
    completed = 'completed'

    def __str__(self):
        return self.value

class Task(TrackedModel):
    name = db.Column(db.String(255), nullable=False)    
    status = db.Column(db.Enum(State), default=State.not_started)

    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))
    project = db.relationship('Project', back_populates='tasks')
    tracked_time = db.relationship('Progress', cascade='all,delete-orphan')

    # Not saved to database, used only in the API
    time_stamp = None
    time_spent = 0

    def __init__(self, name, project_id):
        self.name = name
        self.project_id = project_id

    def _get_spent_time(self, session=db.session()):
        """Get spent time in seconds

        Args:
            session (database session, optional): Database session. Defaults to db.session().

        Returns:
            int: time spent in seconds
        """
        spent_time_result = session.execute(SPENT_TIME_QUERY, {
            'task_id': self.id
        })
        time_spent = spent_time_result.fetchone()[0]
        return time_spent

    def _get_active_progress(self, session):
        """Get active progress

        Args:
            session (database session): database session

        Returns:
            Progress: active progress
        """
        # There should only be one progress for active for each task
        progress_result = session.execute(STARTED_PROGRESS_QUERY, {
            'task_id': self.id 
        })
        # Find progress by id and set the end_time to current time
        progress_id = progress_result.fetchone()[0]
        progress = Progress.query.get(progress_id)
        return progress

    def delete(self):
        session = db.session()
        try:
            session.delete(self)
            session.commit()
        except Exception:
            return False
        return True

    def start(self):
        if self.status != State.not_started and \
           self.status != State.paused:
            return False
        self.status = State.started
        progress = Progress(self.id)
        session = db.session()
        try:
            session.add(progress)
            session.add(self)
            session.commit()
        except Exception:
            return False
        # Update for query
        self.time_stamp = progress.start_time
        self.time_spent = self._get_spent_time(session=session)
        return True

    def resume(self):
        if self.status != State.completed:
            return False
        self.status = State.paused
        session = db.session()
        try:
            session.add(self)
            session.commit()
        except Exception:
            return False
        self.time_stamp = None
        self.time_spent = self._get_spent_time(session=session)
        return True 

    def pause(self):
        if self.status != State.started:
            return False
        self.status = State.paused
        session = db.session()
        progress = self._get_active_progress(session)
        progress.end_time = db.func.current_timestamp()
        try:
            session.add(progress)
            session.add(self)
            session.commit()
        except Exception:
            return False
        # Update for query
        self.time_stamp = None
        self.time_spent = self._get_spent_time(session=session)
        return True 

    def complete(self):
        if self.status == State.completed:
            return False
        session = db.session()
        try:
            if self.status == State.started:
                progress = self._get_active_progress(session)
                progress.end_time = db.func.current_timestamp()
                session.add(progress)
            self.status = State.completed
            session.add(self)
            session.commit()
        except Exception:
            return False
        # Update for query
        self.time_spent = self._get_spent_time(session=session)
        self.time_stamp = None
        return True        

    def update(self):
        session = db.session()
        try:
            session.add(self)
            session.commit()
        except Exception:
            return False
        return True

    def reset(self):
        self.status = State.not_started
        session = db.session()
        try:
            session.execute(DELETE_ALL_PROGRESS, {
                'task_id': self.id
            })
            session.add(self)
            session.commit()
        except Exception:
            return False
        # Update for query
        self.time_spent = 0
        self.time_stamp = None
        return True

    def serialize(self):
        return { 
            'id': self.id, 
            'name' : self.name, 
            'status': str(self.status),
            'time_stamp': self.time_stamp,
            'time_spent': self.time_spent
        }