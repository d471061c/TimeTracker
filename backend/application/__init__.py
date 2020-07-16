import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

RESOURCES = "../resources"

app = Flask(__name__, static_folder=f"{RESOURCES}/static", template_folder=f"{RESOURCES}/templates")
CORS(app)

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{RESOURCES}/data/database.db"
app.config["SQLALCHEMY_ECHO"] = False
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
db.create_all()

@app.route("/")
def homepage():
    return "Hello, Time Tracking!"
