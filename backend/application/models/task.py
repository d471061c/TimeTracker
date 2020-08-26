from application import db
from .basemodel import TrackedModel

class Task(TrackedModel):
    name = db.Column(db.String(255), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))
    project = db.relationship('Project', back_populates='tasks')
    tracked_time = db.relationship('Progress', cascade='all,delete-orphan')
    
    def __init__(self, name, project_id):
        self.name = name
        self.project_id = project_id

    def serialize(self):
        return { 
            'id': self.id, 
            'name' : self.name, 
            'completed': self.completed,
            'progress': [ttime for ttime in self.tracked_time]
        }