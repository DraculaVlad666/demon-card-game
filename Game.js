let score = 0;
let level = 1;
let rerollAttempts = 10;

document.getElementById('drawCard').addEventListener('click', function() {
    const cardValue = Math.floor(Math.random() * 6) + 1; // Случайное число от 1 до 6
    document.getElementById('card').innerText = cardValue;

    // Разблокируем кнопку броска кубика
    document.getElementById('rollDice').disabled = false;
});

document.getElementById('rollDice').addEventListener('click', function() {
    const diceValue = Math.floor(Math.random() * 6) + 1; // Случайное число от 1 до 6
    document.getElementById('dice').innerText = diceValue;

    if (document.getElementById('card').innerText != '?') {
        if (parseInt(document.getElementById('card').innerText) === diceValue) {
            score++;
            document.getElementById('score').innerText = `Очки: ${score}`;
            if (score >= 3) {
                level++;
                score = 0; // Сбросить очки
                rerollAttempts += 10; // Добавить 10 попыток
                document.getElementById('rerollAttempts').innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;
                document.getElementById('level').innerText = `Уровень: ${level}`;
                alert(`Поздравляем! Вы достигли уровня ${level}`);
            }
        }
    }
    // Блокируем кнопку броска кубика
    document.getElementById('rollDice').disabled = true;
    // Блокируем кнопку перекинуть, если попытки закончились
    document.getElementById('rerollDice').disabled = rerollAttempts <= 0;
});

document.getElementById('rerollDice').addEventListener('click', function() {
    if (rerollAttempts > 0) {
        rerollAttempts--;
        document.getElementById('rerollAttempts').innerText = `Осталось попыток перекинуть: ${rerollAttempts}`;
        // Бросаем кубик заново
        document.getElementById('rollDice').click(); // Имитация клика
    }
});
