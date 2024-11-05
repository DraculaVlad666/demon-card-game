from flask import Flask, render_template, jsonify, request
import sqlite3
import os

app = Flask(__name__)

# Маршрут для рендера основного шаблона
@app.route('/')
def index():
    return render_template('index.html')

# Функция для работы с базой данных
def save_to_db(data):
    conn = sqlite3.connect('game_progress.db')
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE IF NOT EXISTS progress (id INTEGER PRIMARY KEY, score INTEGER)')
    cursor.execute('INSERT INTO progress (score) VALUES (?)', (data,))
    conn.commit()
    conn.close()

def get_score_from_db():
    conn = sqlite3.connect('game_progress.db')
    cursor = conn.cursor()
    cursor.execute('SELECT score FROM progress ORDER BY id DESC LIMIT 1')
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else 0

# Маршрут для сохранения прогресса
@app.route('/save_progress', methods=['POST'])
def save_progress():
    data = request.json.get('score', 0)
    save_to_db(data)
    return jsonify(success=True)

# Маршрут для получения прогресса
@app.route('/get_progress', methods=['GET'])
def get_progress():
    score = get_score_from_db()
    return jsonify(score=score)

if __name__ == '__main__':
    app.run(debug=True)
