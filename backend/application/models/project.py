from application import db

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    owner = db.relationship('Account', back_populates='projects')

    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(),
                                           onupdate=db.func.current_timestamp())

    def __init__(self, owner_id, name):
        self.owner_id = owner_id
        self.name = name

    def serialize(self):
        return { 'id': self.id, 'name': self.name }
    