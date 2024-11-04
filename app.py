from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # Разрешаем кросс-доменные запросы

# Функция для создания базы данных
def init_db():
    conn = sqlite3.connect('game_progress.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS user_progress
                 (user_id TEXT PRIMARY KEY, level INTEGER, score INTEGER)''')
    conn.commit()
    conn.close()

# Инициализация базы данных
init_db()

@app.route('/save_progress', methods=['POST'])
def save_progress():
    data = request.json
    user_id = data['user_id']
    level = data['level']
    score = data['score']
    
    conn = sqlite3.connect('game_progress.db')
    c = conn.cursor()
    
    # Проверка, существует ли пользователь
    c.execute('SELECT * FROM user_progress WHERE user_id = ?', (user_id,))
    if c.fetchone():
        # Обновление уровня и очков, если пользователь уже существует
        c.execute('UPDATE user_progress SET level = ?, score = ? WHERE user_id = ?', (level, score, user_id))
    else:
        # Вставка нового пользователя
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
        return jsonify({"level": 1, "score": 0})  # Если нет данных, возвращаем уровень 1 и 0 очков

if __name__ == '__main__':
    app.run(debug=True)  # Запускаем сервер
