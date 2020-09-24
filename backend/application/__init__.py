import os, logging, sys

from flask import Flask, render_template, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

RESOURCES = "resources"

app = Flask(__name__, static_folder=f"../{RESOURCES}/static", template_folder=f"../{RESOURCES}/templates", static_url_path='/')
CORS(app)

# Database Configuration
if os.environ.get("DATABASE_URL"):
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
else:
    print("DATABASE_URL not set, quitting.")
    sys.exit()

app.config["SQLALCHEMY_ECHO"] = False
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Configure JWT
from .config.security import configure_jwt
jwt = configure_jwt(app)

# API
from .api.register import register_api
from .api.project import project_api
from .api.task import task_api
app.register_blueprint(register_api)
app.register_blueprint(project_api)
app.register_blueprint(task_api)

# Create tables
db.create_all()

@app.route("/")
def homepage():
    return render_template("index.html")

@app.errorhandler(404)
def page_not_found(error):
    return render_template("index.html")