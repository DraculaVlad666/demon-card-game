from flask import Flask, render_template, request, jsonify
import sqlite3
import random

app = Flask(__name__)

# Инициализация базы данных
def init_db():
    conn = sqlite3.connect('game_progress.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS progress (
            user_id INTEGER PRIMARY KEY,
            score INTEGER,
            attempts INTEGER
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def save_progress(user_id, score, attempts):
    conn = sqlite3.connect('game_progress.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO progress (user_id, score, attempts) VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET score=?, attempts=?
    ''', (user_id, score, attempts, score, attempts))
    conn.commit()
    conn.close()

def load_progress(user_id):
    conn = sqlite3.connect('game_progress.db')
    cursor = conn.cursor()
    cursor.execute('SELECT score, attempts FROM progress WHERE user_id = ?', (user_id,))
    result = cursor.fetchone()
    conn.close()
    return result if result else (0, 10)  # Возвращаем 0 очков и 10 попыток по умолчанию

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_game/<int:user_id>', methods=['GET'])
def start_game(user_id):
    score, attempts = load_progress(user_id)
    return jsonify({'score': score, 'attempts': attempts})

@app.route('/draw_card', methods=['POST'])
def draw_card():
    card = random.randint(1, 6)  # Изменить диапазон карт
    return jsonify({'card': card})

@app.route('/roll_dice', methods=['POST'])
def roll_dice():
    dice = random.randint(1, 6)
    return jsonify({'dice': dice})

@app.route('/end_game/<int:user_id>/<int:score>/<int:attempts>', methods=['POST'])
def end_game(user_id, score, attempts):
    save_progress(user_id, score, attempts)
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)
