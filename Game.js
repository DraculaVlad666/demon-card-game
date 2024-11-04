let currentLevel = 1;  // Уровень игрока
const userId = 'user123';  // Замените на реальный идентификатор пользователя

// Функция для сохранения прогресса
function saveProgress(userId, level) {
    fetch('http://127.0.0.1:5000/save_progress', {  // Укажите ваш URL, здесь использован локальный сервер
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            level: level
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Сетевая ошибка'); // Обрабатываем сетевые ошибки
        }
        return response.json();
    })
    .then(data => {
        console.log('Прогресс сохранен:', data);
    })
    .catch((error) => {
        console.error('Ошибка при сохранении прогресса:', error);
    });
}

// Функция для получения прогресса
function getProgress(userId) {
    fetch(`http://127.0.0.1:5000/get_progress/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Сетевая ошибка'); // Обрабатываем сетевые ошибки
            }
            return response.json();
        })
        .then(data => {
            currentLevel = data.level;  // Обновляем уровень игрока
            document.getElementById('level').innerText = `Уровень: ${currentLevel}`;
            // Дополнительный код для настройки игры на основе уровня
        })
        .catch((error) => {
            console.error('Ошибка при получении прогресса:', error);
        });
}

// Вызов функции получения прогресса при загрузке игры
window.onload = function() {
    getProgress(userId);
};

// Пример функции для завершения игры
function endGame() {
    saveProgress(userId, currentLevel);
    // Дополнительный код для завершения игры
}
