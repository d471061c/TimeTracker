from application import db
from .basemodel import TrackedModel

class Project(TrackedModel):
    name = db.Column(db.String(255), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    owner = db.relationship('Account', back_populates='projects')
    tasks = db.relationship('Task')

    def __init__(self, owner_id, name):
        self.owner_id = owner_id
        self.name = name

    def serialize(self):
        return { 'id': self.id, 'name': self.name, 'tasks': [task.serialize() for task in self.tasks] }
    