import logging
import sqlite3
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder, 
    CommandHandler, 
    CallbackQueryHandler, 
    MessageHandler, 
    filters,  
    ContextTypes
)
import asyncio

# Включаем логирование
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# Список страшных историй с текстами
scary_stories = {
    "Дико страшная история": "Дело было ночью, кот, как обычно спал в ногах. Я тоже заснула...",
    "Спиритизм и его последствия!": "Моя одна знакомая, со своими подругами, подвыпив, решили вызвать духа Пушкина...",
    "Игра в смерть": "Ох, это лучше и не рассказывать, всё равно не поверят...",
    "Домовой": "Мне было 15, троюродному брату 16...",
    "Кого видят дети?": "Однажды — мне было шесть лет — я проснулся будто от толчка...",
    "Чёрный кот": "Мы тогда жили в Казахстане. У нас был большой дом..."
}

# Создание и подключение к базе данных
def create_connection():
    conn = sqlite3.connect('game_progress.db')
    return conn

# Создание таблицы пользователей
def create_user_table():
    conn = create_connection()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (user_id INTEGER PRIMARY KEY, username TEXT, current_level INTEGER, score INTEGER)''')
    conn.commit()
    conn.close()

# Сохранение прогресса игрока
def save_progress(user_id, username, level, score):
    conn = create_connection()
    c = conn.cursor()
    c.execute('''INSERT OR REPLACE INTO users (user_id, username, current_level, score) VALUES (?, ?, ?, ?)''',
              (user_id, username, level, score))
    conn.commit()
    conn.close()

# Получение прогресса игрока
def get_user_progress(user_id):
    conn = create_connection()
    c = conn.cursor()
    c.execute('''SELECT username, current_level, score FROM users WHERE user_id = ?''', (user_id,))
    row = c.fetchone()
    conn.close()
    return row if row else (None, 0, 0)  # Возвращает None, уровень 0 и очки 0, если игрок не найден

# Функция для обработки команды /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.message.from_user
    logger.info(f"Пользователь {user.first_name} начал общение с ботом.")
    
    # Создание кнопок с обновлённым текстом
    keyboard = [
        [InlineKeyboardButton("Тогда начнём нашу игру, путник", callback_data='start_game')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(f"Плохо утра или ночи, {user.first_name}! Привет! Выберите действие:", reply_markup=reply_markup)

# Обработка нажатий на кнопки
async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()  # Подтверждение нажатия кнопки

    if query.data == 'start_game':
        # Сохраняем пользователя в базе данных, если его еще нет
        user = query.from_user
        save_progress(user.id, user.first_name, 0, 0)

        # Создание новых кнопок после начала игры
        keyboard = [
            [InlineKeyboardButton("Желаете услышать страшные истории?", callback_data='scary_stories')],
            [InlineKeyboardButton("Сыграете с демонами в карты?", callback_data='play_cards')],
            [InlineKeyboardButton("Показать мой прогресс", callback_data='show_progress')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(text="Игра началась! Что вы хотите сделать?", reply_markup=reply_markup)

    elif query.data == 'scary_stories':
        # Создание кнопок для выбора историй
        keyboard = [
            [InlineKeyboardButton("Дико страшная\nистория", callback_data="Дико страшная история")],
            [InlineKeyboardButton("Спиритизм и его\nпоследствия!", callback_data="Спиритизм и его последствия!")],
            [InlineKeyboardButton("Игра в\nсмерть", callback_data="Игра в смерть")],
            [InlineKeyboardButton("Домовой", callback_data="Домовой")],
            [InlineKeyboardButton("Кого видят\nдети?", callback_data="Кого видят дети?")],
            [InlineKeyboardButton("Чёрный кот", callback_data="Чёрный кот")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(text="Выберите историю, которую хотите услышать:", reply_markup=reply_markup)

    elif query.data in scary_stories:
        # Отправка текста выбранной истории и вывод новых кнопок
        story_text = scary_stories[query.data]
        
        # Кнопки для выбора действий после прочтения истории
        keyboard = [
            [InlineKeyboardButton("Выбрать другую историю", callback_data='scary_stories')],
            [InlineKeyboardButton("Перейти в игру", callback_data='play_cards')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        # Отправка текста истории и вывод новых кнопок
        await query.edit_message_text(text=story_text, reply_markup=reply_markup)

    elif query.data == 'play_cards':
        # Кнопка для перехода к игре на GitHub Pages
        keyboard = [
            [InlineKeyboardButton("Играть в карты с демоном", url="https://draculavlad666.github.io/demon-card-game/")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(text="Вы начали играть в карты с демонами! Нажмите на кнопку ниже, чтобы открыть игру.", reply_markup=reply_markup)

    elif query.data == 'show_progress':
        user_id = query.from_user.id
        username, current_level, score = get_user_progress(user_id)
        if username is None:
            await query.edit_message_text(text="Ваш прогресс не найден.")
        else:
            await query.edit_message_text(text=f"Ваши данные:\nИмя: {username}\nУровень: {current_level}\nОчки: {score}")

# Обработка всех текстовых сообщений
async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    # Если сообщение не является командой /start, то отправляем приветственное сообщение с кнопкой
    if update.message.text and update.message.text.lower() != "/start":
        await start(update, context)

# Основная функция для запуска бота
async def main():
    # Создаем таблицу пользователей
    create_user_table()

    # Токен, полученный от BotFather
    token = "8059647384:AAGE9ZdbgtP1y8A2-srR20yNey6nm6SeCsc"
    
    # Создаем приложение
    application = ApplicationBuilder().token(token).build()
    
    # Добавляем обработчики
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(button_handler))  # Обработчик для кнопок
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))  # Обработчик для текстовых сообщений
    
    # Запускаем бота
    logger.info("Запуск бота...")

    # Инициализация и запуск приложения
    await application.initialize()
    await application.start()
    
    # Ожидаем поступления обновлений
    await application.updater.start_polling()
    
    logger.info("Бот работает...")
    
    # Ожидание, пока не будет вызван сигнал остановки
    await asyncio.Event().wait()

if __name__ == '__main__':
    try:
        # Проверяем существование активного цикла событий
        try:
            loop = asyncio.get_running_loop()
            loop.run_until_complete(main())
        except RuntimeError:  # Если нет активного цикла событий, создаем новый
            asyncio.run(main())
    except Exception as e:
        logger.error(f"Произошла ошибка: {e}")
