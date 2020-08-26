from application import db
from .basemodel import BaseModel

class Progress(BaseModel):
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    task = db.relationship('Task', back_populates='tracked_time')

    start = db.Column(db.DateTime, default=db.func.current_timestamp())
    end = db.Column(db.DateTime, nullable=True)

    def stop():
        self.end = db.func.current_timestamp()

    def serialize(self):
        return {
            'id': self.id,
            'start': self.start,
            'end': self.end
        }