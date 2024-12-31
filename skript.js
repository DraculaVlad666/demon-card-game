let score = 0; // Текущий счет
let level = 1; // Уровень
let rerollAttempts = 10; // Максимальное количество попыток перекинуть кубик
let cardValue = 0; // Хранит значение вытянутой карты
let diceValue = 0;

// Получение user_id из URL
function getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("user_id");
}

const userId = getUserIdFromUrl();
if (!userId) {
    alert("Ошибка: Не удалось получить идентификатор пользователя.");
    throw new Error("Не указан user_id.");
}

// Адрес сервера
const serverUrl = "http://localhost:5000"; // Замените на адрес вашего сервера

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

// Загрузка прогресса при запуске
window.onload = function () {
    loadProgress();
};

// Функция для загрузки прогресса
async function loadProgress() {
    try {
        const response = await fetch(`${serverUrl}/get_progress/${userId}`);
        const data = await response.json();
        
        level = data.level || 1;
        score = data.score || 0;
        rerollAttempts = data.rerollAttempts || 10;

        updateUI(); // Обновляем интерфейс
    } catch (error) {
        console.error("Ошибка загрузки прогресса:", error);
    }
}

// Функция для сохранения прогресса
async function saveProgress() {
    const data = { 
        user_id: userId, 
        level: level, 
        score: score, 
        rerollAttempts: rerollAttempts 
    };

    try {
        const response = await fetch(`${serverUrl}/update_progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log("Прогресс сохранён:", result);
    } catch (error) {
        console.error("Ошибка сохранения прогресса:", error);
    }
}

// Функция для обновления интерфейса
function updateUI() {
    scoreDisplay.innerText = `Очки: ${score}`;
    levelDisplay.innerText = `Уровень: ${level}`;
    rerollAttemptsDisplay.innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;
}

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
        if (score === 3) {
            levelUp(); // Переход на новый уровень
        }
    }

    // Деактивируем кнопку броска кубика
    rollDiceButton.disabled = true;
    rerollDiceButton.disabled = false;

    updateUI(); // Обновляем интерфейс
}

// Функция для перекидывания кубика
function rerollDice() {
    if (rerollAttempts > 0) {
        diceValue = Math.floor(Math.random() * 6) + 1;
        document.getElementById('dice').innerText = `Кубик: ${diceValue}`;
        rerollAttempts--;

        if (cardValue === diceValue) {
            score += 1;
            if (score === 3) {
                levelUp();
            }
        }

        updateUI(); // Обновляем интерфейс

        if (rerollAttempts === 0) {
            rerollDiceButton.disabled = true;
        }
    }
}

// Функция для перехода на новый уровень
function levelUp() {
    level += 1;
    score = 0;
    rerollAttempts = 10;
    updateUI(); // Обновляем интерфейс

    saveProgress(); // Сохраняем прогресс
}

// Сохранение прогресса перед уходом
window.addEventListener('beforeunload', saveProgress);
