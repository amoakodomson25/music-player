



function loadSong(index) {
    const song = songs[index];
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    coverEl.textContent = song.cover;
    audioEl.src = song.file;
}

playBtn.addEventListener('click', () => {
    if (audioEl.paused) {
        audioEl.play();
    } else {
        audioEl.pause();
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioEl.play();
    updatePlayIcon();
});
document.getElementById('prevBtn').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1) % songs.length;
    loadSong(currentSongIndex);
    audioEl.play();
    updatePlayIcon();
});

audioEl.addEventListener('timeupdate', () => {
    const progress = (audioEl.currentTime / audioEl.duration) * 100;
    progressBar.style.width = `${progress}%`;
    progressThumb.style.left = `${progress}%`;
});

function updatePlayIcon() {
    audioEl.paused ? PlayIcon.src = 'play.png' : PlayIcon.src = 'pause.png' ;
}