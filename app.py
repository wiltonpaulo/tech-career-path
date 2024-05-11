from flask import Flask, render_template, request, redirect, url_for
import requests
import os

app = Flask(__name__)

# API endpoints
API_URL = os.environ.get('API_URL')

@app.route('/')
def home():
    return 'Home Page Route'

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
#    app.run(host='0.0.0.0', port=5001, debug=True)
