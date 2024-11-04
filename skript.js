window.addEventListener('load', function() {
    const drawCardButton = document.getElementById('drawCard');
    const rollDiceButton = document.getElementById('rollDice');
    
    drawCardButton.addEventListener('click', function() {
        // Логика для вытаскивания карты
        document.getElementById('card').innerText = 'Карта: ?'; // Пример обновления
    });

    rollDiceButton.addEventListener('click', function() {
        // Логика для броска кубика
        document.getElementById('dice').innerText = 'Кубик: ?'; // Пример обновления
    });
});
