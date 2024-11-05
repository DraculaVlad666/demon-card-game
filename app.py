from flask import Flask, render_template, jsonify, request, send_from_directory
import sqlite3
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# Функции для работы с базой данных
def save_to_db(score):
    conn = sqlite3.connect('game_progress.db')
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE IF NOT EXISTS progress (id INTEGER PRIMARY KEY, score INTEGER)')
    cursor.execute('INSERT INTO progress (score) VALUES (?)', (score,))
    conn.commit()
    conn.close()

def get_latest_score():
    conn = sqlite3.connect('game_progress.db')
    cursor = conn.cursor()
    cursor.execute('SELECT score FROM progress ORDER BY id DESC LIMIT 1')
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else 0

# Маршруты для сохранения и загрузки прогресса
@app.route('/save_progress', methods=['POST'])
def save_progress():
    score = request.json.get('score', 0)
    save_to_db(score)
    return jsonify(success=True)

@app.route('/get_progress', methods=['GET'])
def get_progress():
    score = get_latest_score()
    return jsonify(score=score)

# Обслуживание статических файлов из корня
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    app.run(debug=True)
