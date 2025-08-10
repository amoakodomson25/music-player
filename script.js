const songs = [
    {
        title: 'Asibe Happy',
        artist: 'Kabza De Small',
        cover: 'songs/cover1.jpg',
        file: 'songs/song1.mp3'
    },
    {
        title: 'Abelele (Feat. Ami Faku)',
        artist: 'Kabza De Small x DJ Maphorisa',
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

const titleEl = document.querySelector('.title');
const artistEl = document.querySelector('.artiste');
const coverEl = document.querySelector('.cover-art img');
const playBtn = document.querySelector('.play-pause-button');
const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');
const progressBar = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-bar');
const playIcon = document.querySelector('.play-icon');
const progressThumb = document.querySelector('.progress-thumb');

const audioEl = new Audio();
audioEl.volume = 1;


let currentSongIndex = 0;

loadSong(currentSongIndex);

function loadSong(index) {
    const song = songs[index];
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    coverEl.src = song.cover;
    audioEl.src = song.file;
    updatePlayIcon(); 
    updatePlaylistActive() 
     // Reset progress UI
     progressBar.style.width = '0%';
     progressThumb.style.left = '0%';



    document.body.style.setProperty(
        '--bg-image',
        `url(${song.cover})`
    );
    document.body.style.backgroundImage = `url(${song.cover})`; 
    document.body.style.setProperty('--cover-url', `url(${song.cover})`);
}

audioEl.addEventListener('loadedmetadata', () => {
    totalDurationEl.textContent = formatTime(audioEl.duration);
});
function updatePlayIcon() {
    if (audioEl.paused) {
        playIcon.src = 'assets/play.png';
    } else {
        playIcon.src = 'assets/pause.png';
    }
}

playBtn.addEventListener('click', () => {
    if (audioEl.paused) {
        audioEl.play();
    } else {
        audioEl.pause();
    }
    updatePlayIcon();
    updatePlaylistActive() 

    
});

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

audioEl.addEventListener('timeupdate', () => {
    if (audioEl.duration) {
        const progress = (audioEl.currentTime / audioEl.duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
});

progressContainer.addEventListener('click', (e) => {
    const barWidth = progressContainer.clientWidth; 
    const clickX = e.offsetX; 
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

audioEl.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioEl.play();
    updatePlayIcon();
});

const playlistEl = document.querySelector('.playlist-items');

songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
        <img src="${song.cover}" alt="${song.title}">
        <div>
            <div>${song.title}</div>
            <div style="font-size:12px; color:#bbb;">${song.artist}</div>
        </div>
    `;
    li.addEventListener('click', () => {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        audioEl.play();
        updatePlaylistActive();
        updatePlayIcon();
    });
    playlistEl.appendChild(li);
});

function updatePlaylistActive() {
    document.querySelectorAll('.playlist-items li').forEach((item, idx) => {
        item.classList.toggle('active', idx === currentSongIndex);
    });
}


/*

const volumeBar = document.querySelector('.volume');
const volumeFill = document.querySelector('.volume-fill');
const volumeThumb = document.querySelector('.volume-thumb');

const startPercent = audioEl.volume * 100;
volumeFill.style.width = `${startPercent}%`;
volumeThumb.style.left = `${startPercent}%`;


function setVolumeFromPosition(e) {
    const rect = volumeBar.getBoundingClientRect();
    let volume = (e.clientX - rect.left) / rect.width;
    volume = Math.min(Math.max(volume, 0), 1); // clamp between 0–1
    audioEl.volume = volume;

    // Update both fill and thumb
    const percent = volume * 100;
    volumeFill.style.width = `${percent}%`;
    volumeThumb.style.left = `${percent}%`;
}

// Drag logic
let isDraggingVolume = false;

volumeThumb.addEventListener('mousedown', () => isDraggingVolume = true);
document.addEventListener('mouseup', () => isDraggingVolume = false);
document.addEventListener('mousemove', e => {
    if (isDraggingVolume) setVolumeFromPosition(e);
});

// Click logic
volumeBar.addEventListener('click', setVolumeFromPosition);

// Keep synced with audio element
audioEl.addEventListener('volumechange', () => {
    const percent = audioEl.volume * 100;
    volumeFill.style.width = `${percent}%`;
    volumeThumb.style.left = `${percent}%`;
});


function disableTransitions() {
    volumeFill.style.transition = 'none';
    volumeThumb.style.transition = 'none';
}
function enableTransitions() {
    volumeFill.style.transition = '';
    volumeThumb.style.transition = '';
}

volumeThumb.addEventListener('mousedown', () => {
    isDraggingVolume = true;
    disableTransitions();
});
document.addEventListener('mouseup', () => {
    if (isDraggingVolume) {
        isDraggingVolume = false;
        enableTransitions();
    }
});
*/

const currentTimeEl = document.querySelector('.current-time');
const totalDurationEl = document.querySelector('.total-duration');

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update total duration when song metadata loads
audioEl.addEventListener('loadedmetadata', () => {
    totalDurationEl.textContent = formatTime(audioEl.duration);
});

// Update current time while playing
audioEl.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = formatTime(audioEl.currentTime);
});

function togglePlaylist() {
    document.querySelector('.playist').classList.toggle('collapsed');
}
