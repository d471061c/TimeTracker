from application import db
from .basemodel import TrackedModel

PROJECT_TASKS_BY_ID_QUERY = """
SELECT 
  task.id,
  task.name, 
  task.status,
  SUM(case when progress.end_time is not null then 
            ROUND(DATE_PART('second', progress.end_time-progress.start_time))
       else 0 end) as time_spent
FROM task 
  LEFT JOIN progress on task.id=progress.task_id
WHERE task.project_id=:project_id
GROUP BY task.id
"""

PROJECTS_QUERY = """
SELECT 
  p.id, 
  p.name, 
  COUNT(task.id) as tasks,
  SUM(case when task.status='completed' then 1 else 0 end) as completed,
  (
     SELECT 
           SUM(case when progress.end_time is not null then ROUND(DATE_PART('second', progress.end_time-progress.start_time)) else 0 end) as time_spent 
     FROM task 
     LEFT JOIN progress on task.id=progress.task_id 
     WHERE task.project_id=p.id
   ) as time_spent
FROM project p
LEFT JOIN task on task.project_id = p.id
WHERE p.owner_id=:owner_id
GROUP BY p.id
"""

def query_results(result_keys, result):
    """Return database result as JSON-string

    Args:
        result_keys ([string array]): array of keys in order
        result (database result): database result from the query

    Returns:
        string: JSON-string
    """
    return [dict(zip(result_keys, row)) for row in result.fetchall()]

class Project(TrackedModel):
    name = db.Column(db.String(255), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    owner = db.relationship('Account', back_populates='projects')
    tasks = db.relationship('Task', cascade='all,delete-orphan')

    def __init__(self, owner_id, name):
        self.owner_id = owner_id
        self.name = name

    @staticmethod
    def get_projects_by_owner(account_id):
        """ Fetch projects with account id """
        result = db.session().execute(PROJECTS_QUERY, { 
            'owner_id': account_id 
        })
        return query_results(['id', 'name', 'tasks', 'completed', 'time_spent'], result)

    def get_task_list(self):
        """ Fetch project's tasks """
        result = db.session().execute(PROJECT_TASKS_BY_ID_QUERY, {
            'project_id': self.id
        })
        task_list = query_results(['id', 'name', 'status', 'time_spent'], result)
        return {
            'id': self.id,
            'name': self.name,
            'taskList': task_list,
        }

    def serialize(self):
        return { 
            'id': self.id, 
            'name': self.name
        }