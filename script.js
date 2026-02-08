let lastPlayedIndex = -1;

const musicPlaylist = [
    'instrumentals/1.mp3', 'instrumentals/2.mp3', 'instrumentals/3.mp3',
    'instrumentals/4.mp3', 'instrumentals/5.mp3', 'instrumentals/6.mp3'
];

window.addEventListener('DOMContentLoaded', () => {
    initializeCountdown();
    setupTimeConversion();
    setupMusicPlayer();
    setupVideoMusicInteraction();
});

// ===== INVITATION CHECK =====
function checkInvitation() {
    const input = document.getElementById('loginInput').value.trim();
    
    if (!input) {
        showError('Please type "Andy & Debby" to view the invitation.');
        return;
    }

    const normalized = input.toLowerCase().replace(/[^a-z&]/g, '');
    const target = 'andy&debby';

    if (normalized !== target) {
        showError('Hint: Please enter "Andy & Debby" to see your invitation.');
        return;
    }

    // Grant access
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    playBackgroundMusic();
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

document.getElementById('loginInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkInvitation();
    }
});

// ===== COUNTDOWN =====
function initializeCountdown() {
    const weddingDate = new Date('April 18, 2026 12:00:00 GMT');
    
    function updateCountdown() {
        const now = new Date();
        const timeDiff = weddingDate - now;
        
        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;
        } else {
            const countdown = document.getElementById('countdown');
            if (countdown) {
                countdown.innerHTML = '<h3 style="font-family: Dancing Script, cursive; font-size: 2em; color: var(--turquoise);">The Wedding Day is Here! 🎉</h3>';
            }
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== TIME CONVERSION =====
function setupTimeConversion() {
    const timeDisplays = document.querySelectorAll('.time-display');
    timeDisplays.forEach(display => {
        const gmtTime = display.getAttribute('data-gmt');
        const eventCard = display.closest('.event-card') || display.closest('.event-details');
        if (!eventCard) return;

        const localTimeElement = eventCard.querySelector('.local-time');
        if (!localTimeElement) return;

        const [time, period] = gmtTime.split(' ');
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        const weddingDateTime = new Date(`April 18, 2026 ${hour.toString().padStart(2, '0')}:${minutes}:00 GMT`);
        
        const localTime = weddingDateTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short'
        });

        localTimeElement.textContent = `(${localTime} in your timezone)`;
    });
}

// ===== MUSIC PLAYER =====
function setupMusicPlayer() {
    const audio = document.getElementById('backgroundMusic');
    audio.addEventListener('ended', handleMusicEnded);
    audio.addEventListener('error', () => {
        playBackgroundMusic();
    });
}

function handleMusicEnded() {
    setTimeout(() => {
        playBackgroundMusic();
    }, 100);
}

function playBackgroundMusic() {
    const audio = document.getElementById('backgroundMusic');
    
    if (musicPlaylist.length === 1) {
        audio.src = musicPlaylist[0];
        lastPlayedIndex = 0;
    } else {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * musicPlaylist.length);
        } while (randomIndex === lastPlayedIndex);
        
        lastPlayedIndex = randomIndex;
        audio.src = musicPlaylist[randomIndex];
    }
    
    audio.volume = 0.3;
    
    setTimeout(() => {
        audio.play().catch(() => {
            if (musicPlaylist.length > 1) {
                playBackgroundMusic();
            }
        });
    }, 50);
}

// ===== VIDEO-MUSIC INTERACTION =====
function setupVideoMusicInteraction() {
    const videos = document.querySelectorAll('.song-inline-video video');
    
    videos.forEach(video => {
        // Pause background music when a song video starts playing
        video.addEventListener('play', () => {
            const audio = document.getElementById('backgroundMusic');
            audio.pause();
            
            // Pause any other playing videos
            videos.forEach(otherVideo => {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                }
            });
        });
        
        // Resume background music when video is paused or ends
        video.addEventListener('pause', () => {
            // Only resume if no other video is playing
            const anyPlaying = Array.from(videos).some(v => !v.paused);
            if (!anyPlaying) {
                playBackgroundMusic();
            }
        });
        
        video.addEventListener('ended', () => {
            const anyPlaying = Array.from(videos).some(v => !v.paused);
            if (!anyPlaying) {
                playBackgroundMusic();
            }
        });
    });
}
