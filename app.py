from flask import Flask, render_template, request, jsonify
import sqlite3
import logging

app = Flask(__name__)

# Настройка логирования
logging.basicConfig(level=logging.DEBUG)

def init_db():
    conn = sqlite3.connect('game_progress.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS progress (user_id TEXT PRIMARY KEY, level INTEGER, score INTEGER)''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save_progress', methods=['POST'])
def save_progress():
    data = request.get_json()
    user_id = data['user_id']
    level = data['level']
    score = data['score']
    
    logging.debug(f"Saving progress: user_id={user_id}, level={level}, score={score}")

    conn = sqlite3.connect('game_progress.db')
    c = conn.cursor()
    c.execute('''REPLACE INTO progress (user_id, level, score) VALUES (?, ?, ?)''', (user_id, level, score))
    conn.commit()
    conn.close()
    
    return jsonify({"status": "success"})

@app.route('/get_progress/<user_id>', methods=['GET'])
def get_progress(user_id):
    logging.debug(f"Getting progress for user_id={user_id}")

    conn = sqlite3.connect('game_progress.db')
    c = conn.cursor()
    c.execute('''SELECT level, score FROM progress WHERE user_id = ?''', (user_id,))
    result = c.fetchone()
    conn.close()

    if result:
        logging.debug(f"Progress found: level={result[0]}, score={result[1]}")
        return jsonify({"level": result[0], "score": result[1]})
    else:
        logging.debug("No progress found, returning default values")
        return jsonify({"level": 1, "score": 0})  # Начальные значения

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
