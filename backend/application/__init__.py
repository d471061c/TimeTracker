import os, logging, sys

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

RESOURCES = "resources"

app = Flask(__name__, static_folder=f"../{RESOURCES}/static", template_folder=f"../{RESOURCES}/templates")
CORS(app)

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///../{RESOURCES}/data/database.db"
app.config["SQLALCHEMY_ECHO"] = False
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Configure JWT
from .config.security import configure_jwt
jwt = configure_jwt(app)

# API
from .api.register import register_api
from .api.project import project_api
app.register_blueprint(register_api)
app.register_blueprint(project_api)

# Create tables
db.create_all()

# Logging configuration
# logging.basicConfig(format='%(asctime)s "%(name)s" [ %(levelname)-7s ] %(message)s',
#                         datefmt='%Y-%m-%d %H:%M',
#                         filename=f"{RESOURCES}/logs/server.log",
#                         level=logging.DEBUG)
# app.logger.addHandler(logging.StreamHandler(sys.stdout))
# app.logger.setLevel(logging.DEBUG)

@app.route("/")
def homepage():
    return "Hello, Time Tracking!"
