function saveProgress(userId, level) {
    fetch('/save_progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, level: level })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    });
}
