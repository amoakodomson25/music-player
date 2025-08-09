const songs = [
    {
        title: 'Song One',
        artist: 'Artist One',
        cover: 'songs/cover1.jpg',
        file: 'songs/song1.mp3'
    },
    {
        title: 'Song Two',
        artist: 'Artist Two',
        cover: 'songs/cover2.jpg',
        file: 'songs/song2.mp3'
    },
    {
        title: 'Song Three',
        artist: 'Artist Three',
        cover: 'songs/cover3.jpg',
        file: 'songs/song3.mp3'
    }
];

// DOM Elements
const titleEl = document.querySelector('.title');
const artistEl = document.querySelector('.artiste span');
const coverEl = document.querySelector('.cover-art img');
const playBtn = document.querySelector('.play-pause-button');
const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');
const progressBar = document.querySelector('.progress');
const playIcon = document.querySelector('.play-icon');

// Create an audio element
const audioEl = new Audio();

let currentSongIndex = 0;

// Load the first song initially
loadSong(currentSongIndex);

function loadSong(index) {
    const song = songs[index];
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    coverEl.src = song.cover;
    audioEl.src = song.file;
    updatePlayIcon(); // reset play icon
}

function updatePlayIcon() {
    if (audioEl.paused) {
        playIcon.src = 'assets/play.png';
    } else {
        playIcon.src = 'assets/pause.png';
    }
}

// Play/Pause toggle
playBtn.addEventListener('click', () => {
    if (audioEl.paused) {
        audioEl.play();
    } else {
        audioEl.pause();
    }
    updatePlayIcon();
});

// Next/Prev buttons
nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioEl.play();
});

prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audioEl.play();
});

// Progress bar update
audioEl.addEventListener('timeupdate', () => {
    if (audioEl.duration) {
        const progress = (audioEl.currentTime / audioEl.duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
});
