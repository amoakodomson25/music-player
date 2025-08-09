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