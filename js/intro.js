// MHS Live or Die - Intro Page JavaScript

// HTML5 Video Control
let bgVideo;
let isVideoMuted = true; // Start muted

document.addEventListener('DOMContentLoaded', function() {
    // Start loading sequence
    startLoadingSequence();

    // Add cursor glow effect
    createCursorGlow();

    // Add keyboard shortcut to enter site
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            window.location.href = 'index.html';
        }
        if (e.key === 'Escape') {
            window.location.href = 'index.html';
        }
    });

    // Add floating particles effect
    createFloatingParticles();

    // Add bullet particles
    createBulletParticles();

    // Add scanlines
    createScanlines();

    // Initialize background music (after loading)
    setTimeout(() => {
        initBackgroundMusic();
    }, 3000);

    // Initialize video audio control
    bgVideo = document.getElementById('bgVideo');
    if (bgVideo) {
        bgVideo.volume = 0.7; // Set initial volume to 70%
        console.log('Video element found:', bgVideo);
        console.log('Video source:', bgVideo.src);
        console.log('Video ready state:', bgVideo.readyState);

        // Make sure video plays
        bgVideo.play().catch(err => {
            console.error('Video autoplay failed:', err);
        });
    }
    initVideoAudioControl();
});

// Loading sequence
function startLoadingSequence() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const introContent = document.querySelector('.intro-content');

    const phrases = [
        'Initializing combat systems...',
        'Loading arsenal...',
        'Preparing for deployment...',
        'Checking ammunition...',
        'Establishing connection...',
        'Tactical systems online...',
        'Mission briefing ready...',
        'System armed and ready...'
    ];

    let progress = 0;
    let phraseIndex = 0;

    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        loadingBar.style.width = progress + '%';
        loadingPercentage.textContent = Math.floor(progress) + '%';

        // Change phrase every 20%
        if (Math.floor(progress / 20) > phraseIndex && phraseIndex < phrases.length - 1) {
            phraseIndex = Math.floor(progress / 20);
            loadingText.textContent = phrases[phraseIndex];
        }

        if (progress >= 100) {
            clearInterval(loadingInterval);
            loadingText.textContent = 'System ready. Welcome soldier!';

            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Add 'show' class to trigger fade-in animation
                introContent.classList.add('show');
                startTypingAnimation();
            }, 1000);
        }
    }, 200);
}

// Typing animation for welcome message
function startTypingAnimation() {
    const typingText = document.getElementById('typingText');
    const messages = [
        'Welcome to the battlefield, soldier...',
        'Are you ready to survive?',
        'Choose your path: LIVE or DIE'
    ];

    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentMessage = messages[messageIndex];

        if (!isDeleting) {
            typingText.textContent = currentMessage.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentMessage.length) {
                isDeleting = true;
                setTimeout(type, 2000); // Pause at end
                return;
            }
        } else {
            typingText.textContent = currentMessage.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                messageIndex = (messageIndex + 1) % messages.length;
                setTimeout(type, 500); // Pause before next message
                return;
            }
        }

        setTimeout(type, isDeleting ? 50 : 100);
    }

    setTimeout(type, 1000);
}

// Cursor glow effect
function createCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(255, 0, 0, 0.15) 0%, transparent 70%);
        pointer-events: none;
        z-index: 5;
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(glow);

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.opacity = '1';
    });

    // Smooth glow movement
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        glow.style.left = (glowX - 150) + 'px';
        glow.style.top = (glowY - 150) + 'px';

        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

// Create floating particles
function createFloatingParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const color = Math.random() > 0.5 ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 65, 0.3)';
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 10;
        const animationDelay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${left}%;
            bottom: -10px;
            animation: floatUp ${animationDuration}s ease-in ${animationDelay}s infinite;
            box-shadow: 0 0 10px ${color};
        `;

        particlesContainer.appendChild(particle);
    }

    // Add CSS animation for floating
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add blood drip effect on title hover
const introTitle = document.querySelector('.intro-title');
if (introTitle) {
    introTitle.addEventListener('mouseenter', function() {
        this.style.textShadow = `
            0 0 30px rgba(255, 0, 0, 0.8),
            0 0 60px rgba(0, 255, 65, 0.5),
            0 10px 20px rgba(0, 0, 0, 0.9)
        `;
    });

    introTitle.addEventListener('mouseleave', function() {
        this.style.textShadow = `
            0 0 20px rgba(255, 0, 0, 0.5),
            0 0 40px rgba(0, 255, 65, 0.3),
            0 5px 15px rgba(0, 0, 0, 0.8)
        `;
    });
}

// Background Music Control
function initBackgroundMusic() {
    const music = document.getElementById('introMusic');
    const iframe = document.querySelector('iframe');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const volumeIcon = document.querySelector('.volume-icon');
    const muteIcon = document.querySelector('.mute-icon');

    if (!music) return;

    // Music settings: Start at 45s, end at 106s (1:46)
    const START_TIME = 45;
    const END_TIME = 106;
    const FADE_DURATION = 2; // 2 seconds fade
    const MAX_VOLUME = 0.5; // Maximum volume (50%)
    let isPlaying = false;
    let targetVolume = MAX_VOLUME;
    let isFading = false;

    // Set starting point
    music.currentTime = START_TIME;
    music.volume = 0; // Start at 0 for fade-in

    // Fade in/out functions
    function fadeIn() {
        if (music.volume < targetVolume && isPlaying) {
            music.volume = Math.min(music.volume + 0.02, targetVolume);
            if (music.volume < targetVolume) {
                setTimeout(fadeIn, 50);
            }
        }
    }

    function fadeOut(callback) {
        if (music.volume > 0.01) {
            music.volume = Math.max(music.volume - 0.02, 0);
            setTimeout(() => fadeOut(callback), 50);
        } else {
            music.volume = 0;
            if (callback) callback();
        }
    }

    // Auto-play with user interaction fallback
    const playMusic = () => {
        music.play().then(() => {
            isPlaying = true;
            updatePlayPauseButton();
            fadeIn(); // Fade in on start
        }).catch(error => {
            console.log('Music autoplay blocked. Use player controls to start music.');
        });
    };

    playMusic();

    // Loop music between START_TIME and END_TIME with fade transitions
    music.addEventListener('timeupdate', function() {
        // Start fade out 2 seconds before the end
        if (music.currentTime >= END_TIME - FADE_DURATION && !isFading) {
            isFading = true;
            fadeOut(() => {
                music.currentTime = START_TIME;
                music.volume = 0;
                isFading = false;
                if (isPlaying) {
                    fadeIn();
                }
            });
        }

        // Reset if somehow we pass the end time
        if (music.currentTime >= END_TIME) {
            music.currentTime = START_TIME;
            music.volume = 0;
            if (isPlaying) {
                fadeIn();
            }
        }
    });

    // Update play/pause button UI
    function updatePlayPauseButton() {
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }

    // Play/Pause button control
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (isPlaying) {
                music.pause();
                isPlaying = false;
            } else {
                music.play();
                isPlaying = true;
                // Fade in if resuming
                if (music.volume < targetVolume) {
                    fadeIn();
                }
            }
            updatePlayPauseButton();
        });
    }

    // Volume slider control
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            targetVolume = this.value / 100;
            music.volume = targetVolume;
            // Update mute icon if volume is 0
            if (this.value == 0) {
                volumeIcon.style.display = 'none';
                muteIcon.style.display = 'inline';
            } else {
                volumeIcon.style.display = 'inline';
                muteIcon.style.display = 'none';
            }
        });
    }

    // Mute/Unmute button control
    if (volumeBtn) {
        let previousVolume = 0.5;
        volumeBtn.addEventListener('click', function() {
            if (music.volume > 0) {
                previousVolume = targetVolume;
                targetVolume = 0;
                music.volume = 0;
                volumeSlider.value = 0;
                volumeIcon.style.display = 'none';
                muteIcon.style.display = 'inline';
            } else {
                targetVolume = previousVolume;
                music.volume = targetVolume;
                volumeSlider.value = targetVolume * 100;
                volumeIcon.style.display = 'inline';
                muteIcon.style.display = 'none';
            }
        });
    }

    // Stop music when clicking on video to watch
    if (iframe) {
        const videoWrapper = iframe.closest('.video-wrapper');
        const videoContainer = iframe.closest('.intro-video-container');

        // Immediately pause music when clicking on video area
        if (videoWrapper) {
            videoWrapper.addEventListener('click', function() {
                music.pause();
                isPlaying = false;
                updatePlayPauseButton();
            });
        }

        // Also listen for clicks on the entire video container
        if (videoContainer) {
            videoContainer.addEventListener('click', function() {
                music.pause();
                isPlaying = false;
                updatePlayPauseButton();
            });
        }

        // YouTube iframe API integration for video state changes
        window.addEventListener('message', function(event) {
            if (event.data && typeof event.data === 'string') {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === 'infoDelivery' && data.info && data.info.playerState !== undefined) {
                        // 1 = playing, 2 = paused, 0 = ended
                        if (data.info.playerState === 1) {
                            // Video is playing - keep music paused
                            music.pause();
                            isPlaying = false;
                            updatePlayPauseButton();
                        } else if (data.info.playerState === 2 || data.info.playerState === 0) {
                            // Video paused or ended - resume music from where it was
                            music.play();
                            isPlaying = true;
                            updatePlayPauseButton();
                        }
                    }
                } catch (e) {
                    // Ignore parsing errors
                }
            }
        });
    }
}

// Create bullet particles
function createBulletParticles() {
    const particlesContainer = document.querySelector('.particles');
    const bulletCount = 15;

    for (let i = 0; i < bulletCount; i++) {
        const bullet = document.createElement('div');
        bullet.className = 'bullet-particle';

        const left = Math.random() * 100;
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 5;
        const rotation = Math.random() * 360;

        bullet.style.cssText = `
            left: ${left}%;
            --fall-duration: ${duration}s;
            --rotation: ${rotation}deg;
            animation-delay: ${delay}s;
        `;

        particlesContainer.appendChild(bullet);
    }
}

// Create scanline effects
function createScanlines() {
    const particlesContainer = document.querySelector('.particles');
    const scanlineCount = 3;

    for (let i = 0; i < scanlineCount; i++) {
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        scanline.style.animationDelay = `${i * 1}s`;
        particlesContainer.appendChild(scanline);
    }
}

// Video Audio Control
function initVideoAudioControl() {
    const audioControlBtn = document.getElementById('audioControlBtn');
    const muteIcon = audioControlBtn.querySelector('.mute-icon');
    const unmuteIcon = audioControlBtn.querySelector('.unmute-icon');

    if (!audioControlBtn || !bgVideo) return;

    audioControlBtn.addEventListener('click', function() {
        if (isVideoMuted) {
            // Unmute video
            bgVideo.muted = false;
            bgVideo.volume = 0.7;
            isVideoMuted = false;
            muteIcon.style.display = 'none';
            unmuteIcon.style.display = 'inline';
            console.log('Video unmuted');
        } else {
            // Mute video
            bgVideo.muted = true;
            isVideoMuted = true;
            muteIcon.style.display = 'inline';
            unmuteIcon.style.display = 'none';
            console.log('Video muted');
        }
    });
}

// Console easter egg
console.log('%c MHS LIVE OR DIE ', 'background: #ff0000; color: #fff; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Survival Horror & Battlefield Gaming ', 'background: #00ff41; color: #000; font-size: 14px; padding: 5px;');
console.log('Will you survive? 💀');
