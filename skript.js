let score = 0; // Текущий счет
let level = 1; // Уровень
let rerollAttempts = 10; // Максимальное количество попыток перекинуть кубик
let cardValue = 0; // Хранит значение вытянутой карты
let diceValue = 0;

// Элементы интерфейса
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const rerollAttemptsDisplay = document.getElementById('rerollAttempts');
const drawCardButton = document.getElementById('drawCard');
const rollDiceButton = document.getElementById('rollDice');
const rerollDiceButton = document.getElementById('rerollDice');

// Обработчики событий
drawCardButton.addEventListener('click', drawCard);
rollDiceButton.addEventListener('click', rollDice);
rerollDiceButton.addEventListener('click', rerollDice);

// Функция для вытягивания карты
function drawCard() {
    cardValue = Math.floor(Math.random() * 6) + 1; // Сохраняем значение карты
    document.getElementById('card').innerText = `Карта: ${cardValue}`;

    // Активируем кнопку броска кубика
    rollDiceButton.disabled = false;
}

// Функция для броска кубика
function rollDice() {
    diceValue = Math.floor(Math.random() * 6) + 1; // Сохраняем значение кубика
    document.getElementById('dice').innerText = `Кубик: ${diceValue}`;

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
    rollDiceButton.disabled = true;
    rerollDiceButton.disabled = false;
}

// Функция для перекидывания кубика
function rerollDice() {
    if (rerollAttempts > 0) {
        diceValue = Math.floor(Math.random() * 6) + 1; // Новое значение кубика
        document.getElementById('dice').innerText = `Кубик: ${diceValue}`;
        rerollAttempts--;
        rerollAttemptsDisplay.innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;

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
            rerollDiceButton.disabled = true;
        }
    }
}

// Функция для обновления счета
function updateScore() {
    scoreDisplay.innerText = `Очки: ${score}`;
}

// Функция для перехода на новый уровень
function levelUp() {
    level += 1; // Увеличиваем уровень
    rerollAttempts = 10; // Сбрасываем количество попыток перекинуть кубик
    rerollAttemptsDisplay.innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;
    
    // Обновляем уровень на экране
    levelDisplay.innerText = `Уровень: ${level}`;
    
    // Сбрасываем счет
    score = 0;
    updateScore(); // Обновляем отображение счета
}

// Сохранение прогресса при уходе со страницы
window.addEventListener('beforeunload', function () {
    saveProgress();
});

// Функция для сохранения прогресса
function saveProgress() {
    const userId = "user123"; // Уникальный идентификатор пользователя
    const data = { user_id: userId, level: level, score: score }; // Добавляем счет в данные

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
    const userId = "user123"; // Уникальный идентификатор пользователя
    fetch(`/get_progress/${userId}`)
    .then(response => response.json())
    .then(data => {
        level = data.level;
        score = data.score || 0; // Устанавливаем начальное значение счета
        levelDisplay.innerText = `Уровень: ${level}`;
        updateScore(); // Обновляем отображение счета
    });
};
