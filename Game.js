let score = 0;
let level = 1;
let rerollAttempts = 10;
let cardValue = 0;
let diceValue = 0;

// Получаем элементы из HTML
const drawCardButton = document.getElementById('drawCard');
const rollDiceButton = document.getElementById('rollDice');
const rerollDiceButton = document.getElementById('rerollDice');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const cardDisplay = document.getElementById('card');
const diceDisplay = document.getElementById('dice');
const rerollAttemptsDisplay = document.getElementById('rerollAttempts');

// Получение user_id из URL
function getUserId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("user_id") || "guest";
}
const userId = getUserId();

// События на кнопки
drawCardButton.addEventListener('click', drawCard);
rollDiceButton.addEventListener('click', rollDice);
rerollDiceButton.addEventListener('click', rerollDice);

// Функция для обновления прогресса на сервере
function updateProgress() {
    const data = { user_id: userId, level: level, score: score };

    fetch('http://127.0.0.1:5000/update_progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            console.log("Прогресс успешно сохранен!");
        } else {
            console.error("Ошибка сохранения прогресса:", data);
        }
    })
    .catch(error => console.error("Ошибка запроса:", error));
}

// Логика игры (осталась неизменной, добавлены вызовы updateProgress)
function drawCard() {
    cardValue = Math.floor(Math.random() * 6) + 1;
    cardDisplay.innerText = `Вытянутая карта: ${cardValue}`;
    rollDiceButton.disabled = false;
}

function rollDice() {
    diceValue = Math.floor(Math.random() * 6) + 1;
    diceDisplay.innerText = `Результат броска: ${diceValue}`;
    if (cardValue === diceValue) {
        score += 1;
        updateScore();
        if (score === 3) levelUp();
    }
    rollDiceButton.disabled = true;
    rerollDiceButton.disabled = false;
}

function rerollDice() {
    if (rerollAttempts > 0) {
        diceValue = Math.floor(Math.random() * 6) + 1;
        diceDisplay.innerText = `Результат перекидывания: ${diceValue}`;
        rerollAttempts--;
        rerollAttemptsDisplay.innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;
        if (cardValue === diceValue) {
            score += 1;
            updateScore();
            if (score === 3) levelUp();
        }
        if (rerollAttempts === 0) rerollDiceButton.disabled = true;
    }
}

function updateScore() {
    scoreDisplay.innerText = `Очки: ${score}`;
    updateProgress();
}

function levelUp() {
    level += 1;
    rerollAttempts = 10;
    rerollAttemptsDisplay.innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;
    levelDisplay.innerText = `Уровень: ${level}`;
    score = 0;
    updateScore();
}

// Загрузка прогресса при старте
window.onload = function () {
    fetch(`http://127.0.0.1:5000/get_progress/${userId}`)
    .then(response => response.json())
    .then(data => {
        level = data.level || 1;
        score = data.score || 0;
        rerollAttempts = data.rerollAttempts || 10;
        levelDisplay.innerText = `Уровень: ${level}`;
        rerollAttemptsDisplay.innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;
        updateScore();
    })
    .catch(error => console.error("Ошибка загрузки прогресса:", error));
};
