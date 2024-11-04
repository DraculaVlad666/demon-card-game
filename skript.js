window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    const game = new Game();

    // Анимация игры
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас
        game.draw(ctx); // Рисуем игру
        requestAnimationFrame(animate); // Зацикливаем анимацию
    }

    animate();
});

class Game {
    constructor() {
        // Загружаем изображения
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'images/фон.png'; // Путь к фону
        this.cardImage = new Image();
        this.cardImage.src = 'images/карты.png'; // Путь к картам
        this.diceImage =
