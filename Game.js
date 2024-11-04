let score = 0;
let attempts = 10;
let userId = 1;  // Здесь вы должны использовать актуальный ID пользователя

document.addEventListener('DOMContentLoaded', (event) => {
    // Загрузка прогресса при загрузке страницы
    fetch(`/start_game/${userId}`)
        .then(response => response.json())
        .then(data => {
            score = data.score;
            attempts = data.attempts;
            updateUI();
        });

    document.getElementById('drawCard').onclick = function() {
        fetch('/draw_card', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                let drawnCard = data.card;
                document.getElementById('cardValue').innerText = drawnCard;
                updateScore(drawnCard);
            });
    };

    document.getElementById('rollDice').onclick = function() {
        fetch('/roll_dice', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                let diceValue = data.dice;
                document.getElementById('diceValue').innerText = diceValue;
            });
    };
});

function updateScore(drawnCard) {
    let diceValue = parseInt(document.getElementById('diceValue').innerText);
    if (drawnCard === diceValue) {
        score += 1;
        attempts -= 1;  // Уменьшаем количество попыток на 1
    }

    if (score >= 3) {
        // Переход на новый раунд
        alert("Поздравляем! Вы переходите в следующий раунд!");
        score = 0;  // Сбросить очки для следующего раунда
        attempts += 10;  // Дать 10 новых попыток
    }

    saveProgress();
    updateUI();
}

function updateUI() {
    document.getElementById('scoreValue').innerText = score;
    document.getElementById('attemptsValue').innerText = attempts;

    if (attempts <= 0) {
        alert("Игра окончена! Вы не имеете попыток.");
        saveProgress();
        // Здесь можно перезагрузить игру или завершить
    }
}

function saveProgress() {
    fetch(`/end_game/${userId}/${score}/${attempts}`, { method: 'POST' });
}
