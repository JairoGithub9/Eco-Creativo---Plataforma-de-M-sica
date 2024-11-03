document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.controls button');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const action = button.dataset.action;
            const song = button.dataset.song;

            // Hacer una solicitud AJAX según la acción
            fetch(`/${action}/${encodeURIComponent(song)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la solicitud');
                    }
                    return response.json();
                })
                .then(data => {
                    // Manejar la lógica del UI aquí
                    if (action === 'play') {
                        button.style.display = 'none'; // Oculta el botón de Play
                        button.nextElementSibling.style.display = 'inline'; // Muestra el botón de Stop
                        button.nextElementSibling.nextElementSibling.style.display = 'inline'; // Muestra el botón de Pause
                        button.nextElementSibling.nextElementSibling.nextElementSibling.style.display = 'inline'; // Muestra el botón de Resume
                    } else if (action === 'stop') {
                        button.style.display = 'none'; // Oculta el botón de Stop
                        button.previousElementSibling.style.display = 'inline'; // Muestra el botón de Play
                        button.previousElementSibling.nextElementSibling.style.display = 'none'; // Oculta el botón de Pause
                        button.previousElementSibling.nextElementSibling.nextElementSibling.style.display = 'none'; // Oculta el botón de Resume
                    } else if (action === 'pause') {
                        button.style.display = 'none'; // Oculta el botón de Pause
                        button.nextElementSibling.style.display = 'inline'; // Muestra el botón de Resume
                    } else if (action === 'resume') {
                        button.style.display = 'none'; // Oculta el botón de Resume
                        button.previousElementSibling.style.display = 'inline'; // Muestra el botón de Pause
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    });
});
