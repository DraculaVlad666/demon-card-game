let score = 0;

function updateScore(newScore) {
    score = newScore;
    document.getElementById('score').innerText = "Score: " + score;
}

function drawCard() {
    const cardNumber = Math.floor(Math.random() * 6) + 1;
    const diceNumber = Math.floor(Math.random() * 6) + 1;

    if (cardNumber === diceNumber) {
        score += 1;
        updateScore(score);
        saveProgress(score);
    }
    return { card: cardNumber, dice: diceNumber };
}

// Функция сохранения прогресса через API
function saveProgress(score) {
    fetch('/save_progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score: score })
    }).then(response => response.json()).then(data => {
        console.log("Progress saved:", data);
    }).catch(error => console.error("Error saving progress:", error));
}

// Загрузка прогресса при старте игры
function loadProgress() {
    fetch('/get_progress')
        .then(response => response.json())
        .then(data => {
            updateScore(data.score);
        })
        .catch(error => console.error("Error loading progress:", error));
}

document.addEventListener('DOMContentLoaded', loadProgress);
