let score = 0; // Текущий счет
let level = 1; // Уровень
let rerollAttempts = 10; // Максимальное количество попыток перекинуть кубик
let cardValue = 0; // Хранит значение вытянутой карты
let diceValue = 0; // Хранит значение кубика

// Получите user_id из URL, если это возможно
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id') || "user123"; // Уникальный идентификатор пользователя

document.getElementById('drawCard').addEventListener('click', drawCard);
document.getElementById('rollDice').addEventListener('click', rollDice);
document.getElementById('rerollDice').addEventListener('click', rerollDice);

function drawCard() {
    cardValue = Math.floor(Math.random() * 6) + 1; // Сохраняем значение карты
    document.getElementById('card').innerText = cardValue;

    // Активируем кнопку броска кубика
    document.getElementById('rollDice').disabled = false;
}

function rollDice() {
    diceValue = Math.floor(Math.random() * 6) + 1; // Сохраняем значение кубика
    document.getElementById('dice').innerText = diceValue;

    // Проверяем совпадение значений и добавляем очко
    if (cardValue === diceValue) {
        score += 1; // Увеличиваем счет на 1
        updateScore(); // Обновляем отображение счета

        // Проверяем, достиг ли игрок 3 очков
        if (score === 3) {
            levelUp(); // Переход на новый уровень
        }
    }

    // Деактивируем кнопку броска кубика и перекидывания
    document.getElementById('rollDice').disabled = true;
    document.getElementById('rerollDice').disabled = false;
}

function rerollDice() {
    if (rerollAttempts > 0) {
        diceValue = Math.floor(Math.random() * 6) + 1; // Новое значение кубика
        document.getElementById('dice').innerText = diceValue;
        rerollAttempts--;
        document.getElementById('rerollAttempts').innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;

        // Проверяем совпадение значений и добавляем очко
        if (cardValue === diceValue) {
            score += 1; // Увеличиваем счет на 1
            updateScore(); // Обновляем отображение счета

            // Проверяем, достиг ли игрок 3 очков
            if (score === 3) {
                levelUp(); // Переход на новый уровень
            }
        }

        // Деактивируем кнопку перекидывания, если попытки закончились
        if (rerollAttempts === 0) {
            document.getElementById('rerollDice').disabled = true;
        }
    }
}

// Функция для обновления счета
function updateScore() {
    document.getElementById('score').innerText = `Очки: ${score}`;
}

// Функция для перехода на новый уровень
function levelUp() {
    level += 1; // Увеличиваем уровень
    rerollAttempts = 10; // Сбрасываем количество попыток перекинуть кубик
    document.getElementById('rerollAttempts').innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;
    
    // Обновляем уровень на экране
    document.getElementById('level').innerText = `Уровень: ${level}`;
    
    // Сбрасываем счет
    score = 0;
    updateScore(); // Обновляем отображение счета
}

// Сохранение прогресса при уходе со страницы
window.addEventListener('beforeunload', function (event) {
    saveProgress();
});

// Функция для сохранения прогресса
function saveProgress() {
    const data = { user_id: userId, level: level, score: score }; // Передаем уникальный идентификатор пользователя

    fetch('/save_progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data));
}

// Функция для получения прогресса при загрузке страницы
window.onload = function () {
    fetch(`/get_progress/${userId}`)
    .then(response => response.json())
    .then(data => {
        level = data.level;
        score = data.score || 0; // Устанавливаем начальное значение счета
        document.getElementById('level').innerText = `Уровень: ${level}`;
        updateScore(); // Обновляем отображение счета
    });
};
