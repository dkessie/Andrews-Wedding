let lastPlayedIndex = -1;

const musicPlaylist = [
    'instrumentals/1.mp3', 
    'instrumentals/2.mp3', 
    'instrumentals/3.mp3',
    'instrumentals/4.mp3', 
    'instrumentals/5.mp3', 
    'instrumentals/6.mp3'
];

window.addEventListener('DOMContentLoaded', () => {
    initializeCountdown();
    setupMusicPlayer();
});

function checkInvitation() {
    const input = document.getElementById('loginInput').value.trim();
    
    if (!input) {
        alert('Please enter something to continue.');
        return;
    }

    // Accept any input - no validation needed
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    
    // Start playing background music
    playBackgroundMusic();
    
    // Initialize YouTube players after content is shown
    initializeYouTubePlayers();
}

document.getElementById('loginInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkInvitation();
    }
});

function initializeCountdown() {
    const weddingDate = new Date('April 18, 2026 12:00:00 GMT');
    const countdownElement = document.getElementById('countdown');
    
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
        } else if (countdownElement) {
            countdownElement.innerHTML = '<h3 style="color: white;">The Wedding Day is Here!</h3>';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function setupMusicPlayer() {
    const audio = document.getElementById('backgroundMusic');
    audio.removeEventListener('ended', handleMusicEnded);
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
    
    audio.volume = 0.25;
    
    setTimeout(() => {
        audio.play().catch(error => {
            if (musicPlaylist.length > 1) {
                playBackgroundMusic();
            }
        });
    }, 50);
}

function pauseBackgroundMusic() {
    const audio = document.getElementById('backgroundMusic');
    audio.pause();
}

// YouTube Player functionality
let perfectPlayer = null;
let ordinaryPlayer = null;

function initializeYouTubePlayers() {
    // Load YouTube IFrame API
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
}

// This function is called by the YouTube API when it's ready
window.onYouTubeIframeAPIReady = function() {
    console.log('YouTube API Ready');
};

function createYouTubePlayer(containerId, videoId) {
    return new YT.Player(containerId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Player is ready
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    // Handle player state changes if needed
}

function playVideo(videoId) {
    pauseBackgroundMusic();
    
    const modal = document.getElementById(videoId);
    modal.style.display = 'flex';
    
    // Create YouTube player if it doesn't exist
    if (videoId === 'perfect' && !perfectPlayer) {
        if (window.YT && window.YT.Player) {
            perfectPlayer = createYouTubePlayer('perfectPlayer', 'ZycMJWv2vtY');
        }
    } else if (videoId === 'ordinary' && !ordinaryPlayer) {
        if (window.YT && window.YT.Player) {
            ordinaryPlayer = createYouTubePlayer('ordinaryPlayer', 'u2ah9tWTkmk');
        }
    }
    
    // If player exists, play it
    if (videoId === 'perfect' && perfectPlayer && perfectPlayer.playVideo) {
        perfectPlayer.playVideo();
    } else if (videoId === 'ordinary' && ordinaryPlayer && ordinaryPlayer.playVideo) {
        ordinaryPlayer.playVideo();
    }
}

function closeVideo(videoId) {
    const modal = document.getElementById(videoId);
    modal.style.display = 'none';
    
    // Stop the video
    if (videoId === 'perfect' && perfectPlayer && perfectPlayer.pauseVideo) {
        perfectPlayer.pauseVideo();
    } else if (videoId === 'ordinary' && ordinaryPlayer && ordinaryPlayer.pauseVideo) {
        ordinaryPlayer.pauseVideo();
    }
    
    playBackgroundMusic();
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('video-modal')) {
        const videoId = event.target.id;
        closeVideo(videoId);
    }
}