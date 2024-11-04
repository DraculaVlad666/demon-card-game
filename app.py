from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# Функция для создания базы данных
def init_db():
    conn = sqlite3.connect('game_progress.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS user_progress
                 (user_id TEXT PRIMARY KEY, level INTEGER)''')
    conn.commit()
    conn.close()

# Инициализация базы данных
init_db()

@app.route('/')
def index():
    return render_template('index.html')  # Убедитесь, что 'index.html' в папке templates

@app.route('/save_progress', methods=['POST'])
def save_progress():
    data = request.json
    user_id = data['user_id']
    level = data['level']

    conn = sqlite3.connect('game_progress.db')
    c = conn.cursor()

    c.execute('SELECT * FROM user_progress WHERE user_id = ?', (user_id,))
    if c.fetchone():
        c.execute('UPDATE user_progress SET level = ? WHERE user_id = ?', (level, user_id))
    else:
        c.execute('INSERT INTO user_progress (user_id, level) VALUES (?, ?)', (user_id, level))

    conn.commit()
    conn.close()
    return jsonify({"message": "Progress saved!"})

@app.route('/get_progress/<user_id>', methods=['GET'])
def get_progress(user_id):
    conn = sqlite3.connect('game_progress.db')
    c = conn.cursor()

    c.execute('SELECT level FROM user_progress WHERE user_id = ?', (user_id,))
    result = c.fetchone()

    conn.close()
    if result:
        return jsonify({"level": result[0]})
    else:
        return jsonify({"level": 1})  # Если нет данных, возвращаем уровень 1

# Этот маршрут предназначен для передачи изображения фона
@app.route('/ПИКИЧ/<path:filename>')
def send_background(filename):
    return send_from_directory(os.path.join(app.root_path, 'ПИКИЧ'), filename)

# Маршруты для JS и CSS
@app.route('/JS/<path:filename>')
def send_js(filename):
    return send_from_directory(os.path.join(app.root_path, 'JS'), filename)

@app.route('/style.css')
def send_css():
    return send_from_directory(app.root_path, 'style.css')

if __name__ == '__main__':
    app.run(debug=True)
