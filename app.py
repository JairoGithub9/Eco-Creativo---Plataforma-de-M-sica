from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.utils import secure_filename
import os
import yt_dlp
from pygame import mixer

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Necesario para usar flash
mixer.init()

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/music')
def music():
    songs = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(('.mp3', '.wav'))]
    return render_template('music.html', songs=songs)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
    return redirect(url_for('music'))

@app.route('/play/<song>')
def play(song):
    mixer.music.load(os.path.join(UPLOAD_FOLDER, song))
    mixer.music.play()
    return {'status': 'playing'}

@app.route('/pause/<song>')
def pause(song):
    mixer.music.pause()
    return {'status': 'paused'}

@app.route('/resume/<song>')
def resume(song):
    mixer.music.unpause()
    return {'status': 'resumed'}

@app.route('/stop/<song>')
def stop(song):
    mixer.music.stop()
    return {'status': 'stopped'}

@app.route('/record')
def record():
    return render_template('record.html')

@app.route('/download', methods=['GET', 'POST'])
def download():
    if request.method == 'POST':
        video_url = request.form['video_url']
        if video_url:
            try:
                ydl_opts = {
                    'format': 'bestaudio',
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': '192',
                    }],
                    'outtmpl': os.path.join(UPLOAD_FOLDER, '%(title)s.%(ext)s'),
                }

                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([video_url])

                flash('Descarga completada con éxito!', 'success')
            except Exception as e:
                flash(f'Error al descargar: {str(e)}', 'error')
        else:
            flash('Por favor ingresa un enlace de YouTube.', 'error')

    return render_template('download.html')

if __name__ == '__main__':
    app.run(debug=True)
