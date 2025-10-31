// ===== NAVIGATION TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== STATS COUNTER ANIMATION =====
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16); // 60 FPS

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
};

// Intersection Observer for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== VIDEO FILTERING =====
const filterButtons = document.querySelectorAll('.filter-btn');
const videoCards = document.querySelectorAll('.video-card');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            videoCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    const categories = card.getAttribute('data-category');
                    if (categories && categories.includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// ===== YOUTUBE API INTEGRATION =====
// Replace 'YOUR_API_KEY' with your actual YouTube Data API key
const YOUTUBE_API_KEY = 'YOUR_API_KEY';
const CHANNEL_ID = 'UCmhsliveordie6255'; // Extract from @mhsliveordie6255

// Function to fetch latest videos from YouTube
async function fetchYouTubeVideos(maxResults = 6) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch videos');
        }

        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return null;
    }
}

// Function to get video statistics
async function getVideoStats(videoId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=statistics`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch video stats');
        }

        const data = await response.json();
        return data.items[0].statistics;
    } catch (error) {
        console.error('Error fetching video stats:', error);
        return null;
    }
}

// Function to format view count
function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views;
}

// Function to determine video category from title
function determineCategory(title) {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('resident evil') ||
        lowerTitle.includes('silent hill') ||
        lowerTitle.includes('horror') ||
        lowerTitle.includes('re4') ||
        lowerTitle.includes('sh2')) {
        return 'horror';
    } else if (lowerTitle.includes('battlefield') ||
               lowerTitle.includes('bf')) {
        return 'battlefield';
    }
    return 'horror'; // Default
}

// Function to create video card HTML
function createVideoCard(video, stats) {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.high.url;
    const category = determineCategory(title);
    const views = stats ? formatViews(stats.viewCount) : 'N/A';

    const categoryTag = category === 'horror' ?
        '<span class="category horror-tag">Horror</span>' :
        '<span class="category battlefield-tag">Battlefield</span>';

    return `
        <div class="video-card ${category}" data-category="${category}">
            <div class="video-thumbnail">
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                    <img src="${thumbnail}" alt="${title}">
                    <div class="play-button">▶</div>
                </a>
            </div>
            <div class="video-info">
                <h3>${title}</h3>
                <p class="video-meta">
                    ${categoryTag}
                    <span class="views">${views} views</span>
                </p>
            </div>
        </div>
    `;
}

// Function to load videos into the page
async function loadLatestVideos() {
    const container = document.getElementById('latestVideos');

    if (!container) return;

    // Show loading state
    container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Loading videos...</p>';

    const videos = await fetchYouTubeVideos(6);

    if (!videos || videos.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center;">
                <p>No videos found. Check out my channel directly!</p>
                <a href="https://www.youtube.com/@mhsliveordie6255" target="_blank" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">Visit YouTube Channel</a>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    for (const video of videos) {
        if (video.id.videoId) {
            const stats = await getVideoStats(video.id.videoId);
            const cardHTML = createVideoCard(video, stats);
            container.innerHTML += cardHTML;
        }
    }
}

// Function to load all videos for videos page
async function loadAllVideos() {
    const container = document.getElementById('allVideos');

    if (!container) return;

    const videos = await fetchYouTubeVideos(12);

    if (videos && videos.length > 0) {
        // You can process and add videos here similar to loadLatestVideos
        // For now, the manual video cards in the HTML will be used
    }
}

// ===== LOAD MORE FUNCTIONALITY =====
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // This would load more videos from YouTube API
        alert('Load more functionality - integrate with YouTube API for pagination');
    });
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(section);
});

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize background music
    initBackgroundMusic();

    // Load videos if on home page
    if (document.getElementById('latestVideos')) {
        // Uncomment the line below when you have a YouTube API key
        // loadLatestVideos();

        // For now, show a message
        console.log('To display real YouTube videos, add your YouTube Data API key in js/main.js');
    }

    // Load videos if on videos page
    if (document.getElementById('allVideos')) {
        // Uncomment the line below when you have a YouTube API key
        // loadAllVideos();
    }
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ===== PREVENT CONTEXT MENU ON VIDEOS (OPTIONAL) =====
document.querySelectorAll('.video-thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('contextmenu', (e) => {
        // Uncomment to prevent right-click
        // e.preventDefault();
    });
});

// ===== BACKGROUND MUSIC CONTROL =====
function initBackgroundMusic() {
    const music = document.getElementById('mainMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const volumeIcon = document.querySelector('.volume-icon');
    const muteIcon = document.querySelector('.mute-icon');

    if (!music) return;

    // Music settings: Start at 0s, end at 60s (1:00)
    const START_TIME = 0;
    const END_TIME = 60;
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

    // Pause music when clicking on video links
    document.querySelectorAll('.video-card a, a[href*="videos.html"]').forEach(link => {
        link.addEventListener('click', function() {
            music.pause();
            isPlaying = false;
            updatePlayPauseButton();
        });
    });
}
