const songs = [
    {
        title: 'Asibe Happy',
        artist: 'Kabza De Small',
        cover: 'songs/cover1.jpg',
        file: 'songs/song1.mp3'
    },
    {
        title: 'Abelele (Feat. Ami Faku)',
        artist: 'Kabza De Small',
        cover: 'songs/cover2.jpg',
        file: 'songs/song2.mp3'
    },
    {
        title: 'Ngishutheni',
        artist: 'Goon Flavour',
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
const progressContainer = document.querySelector('.progress-bar');
const playIcon = document.querySelector('.play-icon');
const progressThumb = document.querySelector('.progress-thumb');

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

    document.body.style.setProperty(
        '--bg-image',
        `url(${song.cover})`
    );
    document.body.style.backgroundImage = `url(${song.cover})`; // fallback

    // For pseudo-element
    document.body.style.setProperty('--cover-url', `url(${song.cover})`);

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
    updatePlayIcon();
});

prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audioEl.play();
    updatePlayIcon();
});

// Progress bar update
audioEl.addEventListener('timeupdate', () => {
    if (audioEl.duration) {
        const progress = (audioEl.currentTime / audioEl.duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
});

progressContainer.addEventListener('click', (e) => {
    const barWidth = progressContainer.clientWidth; // total width of progress bar
    const clickX = e.offsetX; // position where clicked
    const duration = audioEl.duration;

    if (!isNaN(duration)) {
        audioEl.currentTime = (clickX / barWidth) * duration;
    }
});

let isDragging = false;

progressContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    seek(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        seek(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

function seek(e) {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = progressContainer.clientWidth;
    const duration = audioEl.duration;

    if (!isNaN(duration) && clickX >= 0 && clickX <= width) {
        const newTime = (clickX / width) * duration;
        audioEl.currentTime = newTime;
        updateProgressVisual(clickX / width);
    }
}
audioEl.addEventListener('timeupdate', () => {
    if (!isDragging && audioEl.duration) {
        const percent = audioEl.currentTime / audioEl.duration;
        updateProgressVisual(percent);
    }
});

function updateProgressVisual(percent) {
    progressBar.style.width = `${percent * 100}%`;
    progressThumb.style.left = `${percent * 100}%`;
}

// When song ends, play next
audioEl.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioEl.play();
});