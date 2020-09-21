from enum import Enum

from application import db
from .basemodel import TrackedModel

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
    
    def __init__(self, name, project_id):
        self.name = name
        self.project_id = project_id

    def start(self):
        self.status = State.started
    
    def complete(self):
        self.status = State.completed

    def pause(self):
        self.status = State.paused
    
    def restart(self):
        ''' TODO: Implement this function '''
        self.status = State.not_started

    def serialize(self):
        return { 
            'id': self.id, 
            'name' : self.name, 
            'status': str(self.status),
            'time_stamp': None
        }