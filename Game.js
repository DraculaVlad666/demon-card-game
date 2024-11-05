let score = 0; // Текущий счет
let level = 1; // Уровень
let rerollAttempts = 10; // Максимальное количество попыток перекинуть кубик
let cardValue = 0; // Хранит значение вытянутой карты
let diceValue = 0; // Хранит значение кубика

document.getElementById('drawCard').addEventListener('click', drawCard);
document.getElementById('rollDice').addEventListener('click', rollDice);
document.getElementById('rerollDice').addEventListener('click', rerollDice);

function drawCard() {
    cardValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById('card').innerText = cardValue;
    document.getElementById('rollDice').disabled = false;
}

function rollDice() {
    diceValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice').innerText = diceValue;

    if (cardValue === diceValue) {
        score += 1;
        updateScore();

        if (score === 3) {
            levelUp();
        }
    }

    document.getElementById('rollDice').disabled = true;
    document.getElementById('rerollDice').disabled = false;
}

function rerollDice() {
    if (rerollAttempts > 0) {
        diceValue = Math.floor(Math.random() * 6) + 1;
        document.getElementById('dice').innerText = diceValue;
        rerollAttempts--;
        document.getElementById('rerollAttempts').innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;

        if (cardValue === diceValue) {
            score += 1;
            updateScore();

            if (score === 3) {
                levelUp();
            }
        }

        if (rerollAttempts === 0) {
            document.getElementById('rerollDice').disabled = true;
        }
    }
}

function updateScore() {
    document.getElementById('score').innerText = `Очки: ${score}`;
}

function levelUp() {
    level += 1;
    rerollAttempts = 10;
    document.getElementById('rerollAttempts').innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;
    document.getElementById('level').innerText = `Уровень: ${level}`;
    score = 0;
    updateScore();
}

window.addEventListener('beforeunload', function () {
    saveProgress();
});

function saveProgress() {
    const userId = "user123";
    const data = { user_id: userId, level: level, score: score };

    fetch('/save_progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

window.onload = function () {
    const userId = "user123";
    fetch(`/get_progress/${userId}`)
        .then(response => response.json())
        .then(data => {
            level = data.level;
            score = data.score || 0;
            document.getElementById('level').innerText = `Уровень: ${level}`;
            updateScore();
        });
};
