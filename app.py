from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# Создаем базу данных для хранения прогресса
def init_db():
    conn = sqlite3.connect('game_progress.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS user_progress
                 (user_id TEXT PRIMARY KEY, level INTEGER, score INTEGER)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save_progress', methods=['POST'])
def save_progress():
    data = request.json
    user_id = data['user_id']
    level = data['level']
    score = data['score']

    conn = sqlite3.connect('game_progress.db')
    c = conn.cursor()
    c.execute('SELECT * FROM user_progress WHERE user_id = ?', (user_id,))
    if c.fetchone():
        c.execute('UPDATE user_progress SET level = ?, score = ? WHERE user_id = ?', (level, score, user_id))
    else:
        c.execute('INSERT INTO user_progress (user_id, level, score) VALUES (?, ?, ?)', (user_id, level, score))

    conn.commit()
    conn.close()
    return jsonify({"message": "Progress saved!"})

@app.route('/get_progress/<user_id>', methods=['GET'])
def get_progress(user_id):
    conn = sqlite3.connect('game_progress.db')
    c = conn.cursor()
    c.execute('SELECT level, score FROM user_progress WHERE user_id = ?', (user_id,))
    result = c.fetchone()
    conn.close()
    if result:
        return jsonify({"level": result[0], "score": result[1]})
    else:
        return jsonify({"level": 1, "score": 0})

# Путь для статики и стилей
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.root_path, filename)

if __name__ == '__main__':
    app.run(debug=True)
