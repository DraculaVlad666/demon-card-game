let score = 0;

function updateScore(newScore) {
    score = newScore;
    document.getElementById('score').innerText = "Очки: " + score;
}

function drawCard() {
    const cardNumber = Math.floor(Math.random() * 6) + 1;
    const diceNumber = Math.floor(Math.random() * 6) + 1;

    if (cardNumber === diceNumber) {
        score += 1;
        updateScore(score);
        saveProgress(score);
    }
    alert(`Карта: ${cardNumber}, Кубик: ${diceNumber}`);
}

function rollDice() {
    const diceNumber = Math.floor(Math.random() * 6) + 1;
    alert(`Кубик: ${diceNumber}`);
}

function rerollDice() {
    const diceNumber = Math.floor(Math.random() * 6) + 1;
    alert(`Новый бросок кубика: ${diceNumber}`);
}

// Сохранение прогресса
function saveProgress(score) {
    fetch('/save_progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score: score })
    }).catch(error => console.error("Ошибка сохранения прогресса:", error));
}

// Загрузка прогресса при старте игры
function loadProgress() {
    fetch('/get_progress')
        .then(response => response.json())
        .then(data => updateScore(data.score))
        .catch(error => console.error("Ошибка загрузки прогресса:", error));
}

document.addEventListener('DOMContentLoaded', loadProgress);
