from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Функция для инициализации базы данных
def init_db():
    conn = sqlite3.connect('progress.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_progress (
            user_id TEXT PRIMARY KEY,
            level INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/save_progress', methods=['POST'])
def save_progress():
    data = request.get_json()
    user_id = data['user_id']
    level = data['level']
    
    conn = sqlite3.connect('progress.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO user_progress (user_id, level) 
        VALUES (?, ?) 
        ON CONFLICT(user_id) 
        DO UPDATE SET level = excluded.level
    ''', (user_id, level))
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success', 'message': 'Progress saved'}), 200

@app.route('/get_progress/<user_id>', methods=['GET'])
def get_progress(user_id):
    conn = sqlite3.connect('progress.db')
    cursor = conn.cursor()
    cursor.execute('SELECT level FROM user_progress WHERE user_id = ?', (user_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return jsonify({'level': row[0]}), 200
    else:
        return jsonify({'level': 1}), 200  # Если нет прогресса, возвращаем уровень 1

if __name__ == '__main__':
    init_db()
    app.run(port=5000)  # Убедитесь, что сервер запущен
