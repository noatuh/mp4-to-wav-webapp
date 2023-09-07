document.getElementById('convert').addEventListener('click', function() {
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a WAV file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const audioData = event.target.result;
        const wav = lamejs.WavHeader.readHeader(new DataView(audioData));

        if (!wav) {
            alert('Invalid WAV file.');
            return;
        }

        const samples = new Int16Array(audioData, wav.dataOffset, wav.dataLen / 2);
        const mp3enc = new lamejs.Mp3Encoder(1, wav.sampleRate, 128); // mono, sample rate, kbps
        const mp3Data = mp3enc.encodeBuffer(samples);

        const blob = new Blob([new Uint8Array(mp3Data)], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);

        const downloadLink = document.getElementById('download');
        downloadLink.href = url;
        downloadLink.style.display = 'block';
    };

    reader.readAsArrayBuffer(file);
});
