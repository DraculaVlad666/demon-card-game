// game.js

let score = 0;
let level = 1;
let timeLeft = 999; // Установим время на 999 секунд
let timerId;
let rollAttempts; // Объявляем переменную для попыток

const cardElement = document.getElementById('card');
const diceElement = document.getElementById('dice');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('message');
const rerollButton = document.getElementById('rerollDice');
const rollDiceButton = document.getElementById('rollDice');
const rerollAttemptsElement = document.getElementById('rerollAttempts');

document.getElementById('drawCard').addEventListener('click', drawCard);
rollDiceButton.addEventListener('click', rollDice);
rerollButton.addEventListener('click', rerollDice);

function drawCard() {
    const cardValue = Math.floor(Math.random() * 6) + 1; // Случайное число от 1 до 6
    cardElement.textContent = cardValue; // Отображение значения карты
    rollAttempts = 10; // Сброс попыток при вытягивании новой карты
    updateRerollAttempts(); // Обновляем отображение оставшихся попыток
    rerollButton.disabled = false; // Активируем кнопку перекидывания
    rollDiceButton.disabled = false; // Активируем кнопку броска кубика
    startTimer();
}

function rollDice() {
    const diceValue = Math.floor(Math.random() * 6) + 1; // Случайное число от 1 до 6
    diceElement.textContent = diceValue; // Отображение значения кубика

    // Проверка на совпадение
    if (parseInt(cardElement.textContent) === diceValue) {
        score++; // Увеличиваем счет
        messageElement.textContent = "Поздравляем! Вы угадали!";
        updateScore(); // Обновляем очки
    } else {
        messageElement.textContent = "Попробуйте снова!";
    }

    rollDiceButton.disabled = true; // Отключаем кнопку броска кубика после использования
}

function rerollDice() {
    if (rollAttempts > 0) {
        const diceValue = Math.floor(Math.random() * 6) + 1; // Случайное число от 1 до 6
        diceElement.textContent = diceValue; // Отображение нового значения кубика

        // Проверка на совпадение
        if (parseInt(cardElement.textContent) === diceValue) {
            score++; // Увеличиваем счет
            messageElement.textContent = "Поздравляем! Вы угадали!";
            updateScore(); // Обновляем очки
        } else {
            messageElement.textContent = "Попробуйте снова!";
        }

        rollAttempts--;
        updateRerollAttempts(); // Обновление отображения оставшихся попыток

        // Если попытки закончились, отключаем кнопку
        if (rollAttempts <= 0) {
            rerollButton.disabled = true;
        }
    }
}

function updateRerollAttempts() {
    rerollAttemptsElement.textContent = `Осталось попыток перекинуть: ${rollAttempts}`;
}

function updateScore() {
    scoreElement.textContent = `Очки: ${score}`;
    if (score >= 3) {
        level++;
        score = 0; // Сброс очков на новом уровне
        levelElement.textContent = `Уровень: ${level}`;
        rollAttempts = 10; // Сброс попыток на новом уровне
        updateRerollAttempts(); // Обновление отображения попыток
    }
}

function startTimer() {
    clearInterval(timerId); // Очистка предыдущего таймера
    timeLeft = 999; // Сброс таймера на 999 секунд
    timerElement.textContent = `Осталось времени: ${timeLeft} секунд`;

    timerId = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Осталось времени: ${timeLeft} секунд`;

        if (timeLeft <= 0) {
            clearInterval(timerId);
            messageElement.textContent = "Время вышло!";
            rerollButton.disabled = true; // Отключаем кнопку, если время вышло
            rollDiceButton.disabled = true; // Отключаем кнопку броска кубика, если время вышло
        }
    }, 1000);
}
