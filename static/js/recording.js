let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let isPaused = false;

document.getElementById('start').onclick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPlayback').src = audioUrl;
        document.getElementById('audioPlayback').style.display = 'inline-block';

        const downloadLink = document.getElementById('download');
        downloadLink.href = audioUrl;
        downloadLink.download = 'grabacion.mp3';
        downloadLink.style.display = 'inline-block';
        downloadLink.textContent = 'Descargar Grabación';

        audioChunks = [];
        isRecording = false;
        isPaused = false;
        document.getElementById('status').textContent = '';
    };

    mediaRecorder.start();
    isRecording = true;

    document.getElementById('start').style.display = 'none';
    document.getElementById('stop').style.display = 'inline-block';
    document.getElementById('pause').style.display = 'inline-block';
    document.getElementById('status').textContent = 'Grabando...';
};

document.getElementById('stop').onclick = () => {
    mediaRecorder.stop();
    document.getElementById('stop').style.display = 'none';
    document.getElementById('pause').style.display = 'none';
    document.getElementById('resume').style.display = 'none';
    document.getElementById('start').style.display = 'inline-block';
    document.getElementById('status').textContent = 'Grabación detenida.';
};

document.getElementById('pause').onclick = () => {
    if (isRecording && !isPaused) {
        mediaRecorder.pause();
        isPaused = true;

        document.getElementById('pause').style.display = 'none';
        document.getElementById('resume').style.display = 'inline-block';
        document.getElementById('status').textContent = 'Grabación en pausa.';
    }
};

document.getElementById('resume').onclick = () => {
    if (isRecording && isPaused) {
        mediaRecorder.resume();
        isPaused = false;

        document.getElementById('resume').style.display = 'none';
        document.getElementById('pause').style.display = 'inline-block';
        document.getElementById('status').textContent = 'Grabando...';
    }
};
