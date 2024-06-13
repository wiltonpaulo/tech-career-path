from flask import Flask, render_template, request, redirect, url_for
import requests
import os

app = Flask(__name__)

# API endpoints
API_URL = os.environ.get('API_URL')

@app.route('/')
def index():
    return render_template('main.html')
