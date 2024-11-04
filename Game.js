let currentLevel = 1; // Уровень игрока
const userId = 'user123'; // Уникальный идентификатор пользователя
let score = 0; // Очки игрока
let rerollAttempts = 10; // Количество попыток перекинуть кубик

// Функция для сохранения прогресса
function saveProgress(userId, level, score) {
    fetch('http://127.0.0.1:5000/save_progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            level: level,
            score: score
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Сетевая ошибка');
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
                throw new Error('Сетевая ошибка');
            }
            return response.json();
        })
        .then(data => {
            currentLevel = data.level; // Обновляем уровень игрока
            score = data.score; // Обновляем очки
            document.getElementById('level').innerText = `Уровень: ${currentLevel}`;
            document.getElementById('score').innerText = `Очки: ${score}`;
        })
        .catch((error) => {
            console.error('Ошибка при получении прогресса:', error);
        });
}

// Вызов функции получения прогресса при загрузке игры
window.onload = function() {
    getProgress(userId);
};

// Основная логика игры
document.getElementById('drawCard').addEventListener('click', function() {
    // Логика для вытаскивания карты
    const cards = ['2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠', 'A♠'];
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    document.getElementById('card').innerText = randomCard; // Обновление текста карты
    document.getElementById('rollDice').disabled = false; // Разблокируем кнопку броска кубика
});

document.getElementById('rollDice').addEventListener('click', function() {
    // Логика для броска кубика
    const diceResult = Math.floor(Math.random() * 6) + 1; // Генерация результата кубика
    document.getElementById('dice').innerText = diceResult; // Обновление результата кубика
    score += diceResult; // Увеличиваем очки на результат кубика
    currentLevel++; // Увеличиваем уровень
    document.getElementById('score').innerText = `Очки: ${score}`; // Обновляем очки на экране
    document.getElementById('level').innerText = `Уровень: ${currentLevel}`; // Обновляем уровень на экране
    saveProgress(userId, currentLevel, score); // Сохраняем прогресс
    document.getElementById('rerollDice').disabled = false; // Разблокируем кнопку перекидывания
});

document.getElementById('rerollDice').addEventListener('click', function() {
    if (rerollAttempts > 0) {
        rerollAttempts--; // Уменьшаем количество попыток
        document.getElementById('rerollAttempts').innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;
        
        // Логика для повторного броска кубика
        const diceResult = Math.floor(Math.random() * 6) + 1; // Генерация нового результата кубика
        document.getElementById('dice').innerText = diceResult; // Обновление результата кубика
        score += diceResult; // Увеличиваем очки
        document.getElementById('score').innerText = `Очки: ${score}`; // Обновляем очки на экране
        saveProgress(userId, currentLevel, score); // Сохраняем прогресс
    } else {
        alert("У вас закончились попытки перекинуть кубик!");
    }
});
