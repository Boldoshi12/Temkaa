// ========================================
// Hero Image Lightbox
// ========================================

const heroImage = document.querySelector('.hero-image');

// ========================================
// Interactive Elements Setup
// ========================================

// Get DOM elements
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const buttonsContainer = document.getElementById('buttons-container');
const celebrationOverlay = document.getElementById('celebration-overlay');
const heartsContainer = document.getElementById('hearts-container');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');

// ========================================
// YES Button - Celebration Effect
// ========================================

function triggerCelebration() {
    // Show celebration overlay
    celebrationOverlay.classList.add('active');

    // Create falling hearts
    createFallingHearts();

    // Optional: Play celebratory sound (commented out, can be added)
    // const audio = new Audio('celebration.mp3');
    // audio.play();
}

function createFallingHearts() {
    // Comprehensive love emoji collection
    const loveEmojis = [
        '❤️', '💕', '💖', '💗', '💓', '💞', '💝', '💘',
        '♥️', '💑', '💏', '🥰', '😍', '😘', '😻', '💋',
        '🌹', '💐', '🌺', '🌸', '🌷', '💮', '🏵️', '💌',
        '💒', '👩‍❤️‍👨', '💑', '🤍', '🧡', '💛', '💚', '💙',
        '💜', '🤎', '🖤', '🩷', '🩵', '❣️', '💟'
    ];

    const animations = ['emojiRain', 'emojiSway', 'emojiSpiral'];
    let isRunning = true;
    let emojiCount = 0;

    function createEmoji() {
        const emoji = document.createElement('div');
        emoji.className = 'falling-heart';

        // Random emoji from collection
        emoji.textContent = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];

        // Random horizontal position
        emoji.style.left = Math.random() * 100 + '%';

        // Random size: minimum 40px, maximum 100px
        const size = Math.floor(Math.random() * 61) + 40; // 40-100px
        emoji.style.fontSize = size + 'px';

        // Random animation from the three types
        const animationType = animations[Math.floor(Math.random() * animations.length)];
        emoji.style.animationName = animationType;

        // Random duration: 6-9 seconds
        const duration = (Math.random() * 3 + 6);
        emoji.style.animationDuration = duration + 's';

        // Random delay for staggered start
        const delay = (Math.random() * 0.3);
        emoji.style.animationDelay = delay + 's';

        // Random horizontal drift for non-spiral animations
        if (animationType === 'emojiRain') {
            const drift = (Math.random() * 80 - 40); // -40px to 40px
            emoji.style.setProperty('--drift-x', drift + 'px');
        }

        heartsContainer.appendChild(emoji);
        emojiCount++;

        // Memory management: remove old emojis
        if (emojiCount > 80) {
            const oldEmojis = heartsContainer.querySelectorAll('.falling-heart');
            if (oldEmojis.length > 40) {
                oldEmojis[0].remove();
                emojiCount--;
            }
        }
    }

    // Create emojis continuously
    const emojiInterval = setInterval(() => {
        if (!isRunning) {
            clearInterval(emojiInterval);
            return;
        }
        createEmoji();
    }, 120); // Create emoji every 120ms

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        isRunning = false;
        clearInterval(emojiInterval);
    });
}

yesButton.addEventListener('click', triggerCelebration);

// ========================================
// NO Button - Teleport/Blink Effect
// ========================================

const questionSection = document.getElementById('question');
let isNoButtonAfraid = true;
let isTeleporting = false;
let hasShownReallyAlert = false; // Track if we've shown the alert
let hasMovedNoButton = false; // Track if NO button has been moved to absolute position

function teleportNoButton() {
    if (isTeleporting) return;
    isTeleporting = true;

    // Make NO button absolute positioned after first interaction
    if (!hasMovedNoButton) {
        hasMovedNoButton = true;
        noButton.style.position = 'absolute';
    }

    const containerRect = buttonsContainer.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();

    // Calculate safe boundaries
    const maxX = containerRect.width - buttonRect.width;
    const maxY = containerRect.height - buttonRect.height;

    // Get YES button position
    const yesButtonRect = yesButton.getBoundingClientRect();
    const yesButtonCenterX = yesButtonRect.left - containerRect.left + yesButtonRect.width / 2;
    const yesButtonCenterY = yesButtonRect.top - containerRect.top + yesButtonRect.height / 2;

    // Blink effect - fade out
    noButton.style.opacity = '0';
    noButton.style.transform = 'scale(0.5)';

    setTimeout(() => {
        // Generate random position
        let newX, newY, attempts = 0;
        const minDistanceFromYes = 150; // Minimum safe distance from YES button

        do {
            newX = Math.random() * maxX;
            newY = Math.random() * maxY;

            const buttonCenterX = newX + buttonRect.width / 2;
            const buttonCenterY = newY + buttonRect.height / 2;

            const distanceFromYes = Math.sqrt(
                Math.pow(buttonCenterX - yesButtonCenterX, 2) +
                Math.pow(buttonCenterY - yesButtonCenterY, 2)
            );

            if (distanceFromYes >= minDistanceFromYes) {
                break;
            }

            attempts++;
        } while (attempts < 20);

        // Apply new position
        noButton.style.left = newX + 'px';
        noButton.style.top = newY + 'px';

        // Blink effect - fade in
        setTimeout(() => {
            noButton.style.opacity = '1';
            noButton.style.transform = 'scale(1)';
            isTeleporting = false;
        }, 100);
    }, 150);
}

// Track cursor proximity - NO button is "afraid" of cursor
questionSection.addEventListener('mousemove', (e) => {
    if (!isNoButtonAfraid || isTeleporting) return;

    const buttonRect = noButton.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    // Calculate distance from cursor to NO button center
    const distanceFromCursor = Math.sqrt(
        Math.pow(e.clientX - buttonCenterX, 2) +
        Math.pow(e.clientY - buttonCenterY, 2)
    );

    // If cursor gets too close (within 120px), button teleports away
    const fearDistance = 120;
    if (distanceFromCursor < fearDistance) {
        teleportNoButton();
    }
});

// Teleport on hover
noButton.addEventListener('mouseenter', (e) => {
    e.preventDefault();
    teleportNoButton();
});

// Teleport on touch (mobile)
noButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    teleportNoButton();
});

// Prevent clicking the NO button
noButton.addEventListener('click', (event) => {
    event.preventDefault();

    // Show "Really?" alert only on first click
    if (!hasShownReallyAlert) {
        hasShownReallyAlert = true;
        alert('Really? 🥺');
    }

    teleportNoButton();
});

// Also teleport when user tries to focus via keyboard
noButton.addEventListener('focus', teleportNoButton);

// ========================================
// Gallery Lightbox Functionality
// ========================================

if (heroImage) {
    heroImage.addEventListener('click', () => {
        lightbox.classList.add('active');
        lightboxImage.src = heroImage.src;
        lightboxImage.alt = heroImage.alt;
    });
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ========================================
// Scroll Animations (Optional Enhancement)
// ========================================

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
    observer.observe(item);
});
