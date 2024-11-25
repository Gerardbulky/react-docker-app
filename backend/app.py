from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
import os

if os.path.exists("env.py"):
    import env as env

app = Flask(__name__)


# Use the full MONGO_URI from the environment variable
mongo_uri = os.environ.get("MONGO_URI")

# Set the MongoDB URI in the Flask config
app.config["MONGO_URI"] = mongo_uri
app.secret_key = os.environ.get("SECRET_KEY")

# CORS(app, resources={r"/*": {"origins": "http://52.66.249.115:30005"}}, methods=["GET", "POST"], supports_credentials=True, allow_headers=["Content-Type"])
CORS(app, origins=["http://52.66.249.115:30005"])  # Allow frontend URL

mongo = PyMongo(app)

@app.route('/user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'Invalid data'}), 400
        
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({'message': 'Missing data'}), 400

        user_id = mongo.db.users.insert_one({
            'name': name,
            'email': email,
            'password': password
        }).inserted_id

        return jsonify({'message': 'User created successfully', 'id': str(user_id)}), 201
    except Exception as e:
        return jsonify({'message': 'Error creating user', 'error': str(e)}), 500

@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = mongo.db.users.find()
        user_list = []
        for user in users:
            user_list.append({
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            })
        return jsonify({'users': user_list}), 200
    except Exception as e:
        print("Error fetching users:", e)
        return jsonify({'message': 'Error fetching users', 'error': str(e)}), 500


@app.route('/ok', methods=['GET'])
def health_check():
    return "OK", 200


if __name__ == '__main__':
    app.run(debug=False, host="0.0.0.0", port=5000)