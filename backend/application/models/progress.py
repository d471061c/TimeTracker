from application import db
from .basemodel import BaseModel

class Progress(BaseModel):
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    task = db.relationship('Task', back_populates='tracked_time')

    start_time = db.Column(db.DateTime, default=db.func.current_timestamp())
    end_time = db.Column(db.DateTime, nullable=True)

    def __init__(self, task_id):
        self.task_id = task_id

    def stop(self):
        self.end_time = db.func.current_timestamp()

    def serialize(self):
        return {
            'id': self.id,
            'start': self.start_time,
            'end': self.end_time
        }