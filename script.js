// ===============================================
// ECHOES OF HALLOWNEST - PORTFOLIO JAVASCRIPT
// Particle System, Tab Filtering, Scroll Animations
// ===============================================

// ============= CUSTOM CURSOR =============
let cursorX = 0;
let cursorY = 0;
let cursorDotX = 0;
let cursorDotY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

function animateCursor() {
    // Smooth cursor follow
    cursorDotX += (cursorX - cursorDotX) * 0.3;
    cursorDotY += (cursorY - cursorDotY) * 0.3;
    
    // Update cursor position using CSS custom properties
    document.body.style.setProperty('--cursor-x', cursorX + 'px');
    document.body.style.setProperty('--cursor-y', cursorY + 'px');
    document.body.style.setProperty('--cursor-dot-x', cursorDotX + 'px');
    document.body.style.setProperty('--cursor-dot-y', cursorDotY + 'px');
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// ============= PARTICLE SYSTEM =============
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // Start at random position initially
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.002 + 0.001;
        this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        // Gentle opacity pulsing
        this.opacity += this.fadeSpeed * this.fadeDirection;
        if (this.opacity <= 0.1 || this.opacity >= 0.7) {
            this.fadeDirection *= -1;
        }
        
        // Reset if out of bounds
        if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
            this.reset();
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(203, 213, 225, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Create particles
const particleCount = 80;
const particles = [];

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ============= SMOOTH SCROLL =============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Do not intercept modal action links (they may be repurposed to open external repos)
        if (this.classList && this.classList.contains('modal-link')) return;

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

// ============= SCROLL ANIMATIONS =============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.journal-entry, .project-card, .timeline-item').forEach(el => {
    observer.observe(el);
});

// ============= NAVIGATION HIGHLIGHT =============
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navToggleBtn = document.querySelector('.nav-toggle');
const navContainer = document.querySelector('.nav-container');

if (navToggleBtn && navContainer) {
    navToggleBtn.addEventListener('click', () => {
        navContainer.classList.toggle('nav-open');
        const isOpen = navContainer.classList.contains('nav-open');
        navToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('nav-open');
            navToggleBtn.setAttribute('aria-expanded', 'false');
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navContainer.classList.remove('nav-open');
            navToggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ============= PROJECT FILTERING =============
const filterTabs = document.querySelectorAll('.tab');
const projectCards = document.querySelectorAll('.project-card');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');
        
        // Update active tab
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Filter projects with staggered animation
        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                setTimeout(() => {
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                }, index * 50);
            } else {
                card.classList.add('hidden');
                card.classList.remove('visible');
            }
        });
    });
});

// ============= PROJECT MODAL =============
const modal = document.querySelector('.project-modal');
const modalTitle = document.querySelector('.modal-title');
const modalDesc = document.querySelector('.modal-desc');
const modalTags = document.querySelector('.modal-tags');
const modalLink = document.querySelector('.modal-link');
const modalClose = document.querySelector('.modal-close-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const modalFrame = document.querySelector('.modal-frame');
const modalLoading = document.querySelector('.modal-loading');
const modalDotsContainer = document.querySelector('.preview-dots');
const modalPrev = document.querySelector('.preview-nav.prev');
const modalNext = document.querySelector('.preview-nav.next');

let modalSlides = [];
let modalDots = [];
let currentSlide = 0;

// Video cache for preloading
const videoCache = new Map();

function showLoadingScreen() {
    if (modalLoading) {
        modalLoading.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    if (modalLoading) {
        modalLoading.classList.add('hidden');
    }
}

function buildModalSlides(images, title, link) {
    modalSlides = [];
    modalDots = [];
    currentSlide = 0;

    if (!modalFrame || !modalDotsContainer) return;

    // Preserve the loading screen element before clearing
    const loadingScreen = modalFrame.querySelector('.modal-loading');
    
    modalFrame.innerHTML = '';
    modalDotsContainer.innerHTML = '';
    
    // Re-append the loading screen so it can be shown during loading
    if (loadingScreen) {
        modalFrame.appendChild(loadingScreen);
    }

    const sources = (images || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    // If a video link is provided and it's an mp4, create a video slide as the first slide.
    let slideIndex = 0;
    if (link && typeof link === 'string' && link.trim().toLowerCase().endsWith('.mp4')) {
        const videoSlide = document.createElement('div');
        videoSlide.className = 'modal-image';

        // Check if video is already cached
        let video;
        if (videoCache.has(link)) {
            video = videoCache.get(link);
        } else {
            video = document.createElement('video');
            video.src = link;
            video.preload = 'auto'; // Preload the entire video
            video.autoplay = false;
            video.muted = false;
            video.loop = true;
            video.playsInline = true;
            video.setAttribute('aria-label', title || 'Project video');
            videoCache.set(link, video);
        }
        
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';

        // append video first (thumb will sit above it)
        videoSlide.appendChild(video);

        // If the project provided images, use the first image as a temporary thumbnail
        let thumb;
        if (sources.length > 0) {
            thumb = document.createElement('img');
            thumb.className = 'video-thumb';
            thumb.src = sources[0];
            thumb.alt = title ? `${title} thumbnail` : 'Video thumbnail';
            // start fully visible; set to fade via CSS and JS
            thumb.style.opacity = '1';
            videoSlide.appendChild(thumb);
        }

        videoSlide.title = title || 'Project video';

        // mark active initially; playback is controlled in setSlide()
        videoSlide.classList.add('active');
        modalFrame.appendChild(videoSlide);
        modalSlides.push(videoSlide);

        const dot = document.createElement('div');
        dot.className = 'preview-dot';
        dot.classList.add('active');
        dot.addEventListener('click', () => setSlide(0));
        modalDotsContainer.appendChild(dot);
        modalDots.push(dot);

        slideIndex = 1; // images start after the video
    }

    const hasImages = sources.length > 0;
    const slidesData = hasImages ? sources : ['placeholder'];

    slidesData.forEach((src, idx) => {
        const slide = document.createElement('div');
        slide.className = 'modal-image';

        // If there's a real image, use it directly (no dark gradient on top).
        // For placeholders, keep a subtle gradient so the box isn't empty.
        if (hasImages && src !== 'placeholder') {
            slide.style.backgroundImage = `url(${src})`;
            slide.title = title || 'Project image';
        } else {
            slide.classList.add('placeholder');
            slide.textContent = 'Preview coming soon';
            slide.style.backgroundImage = 'linear-gradient(135deg, rgba(56, 189, 248, 0.06), rgba(2, 2, 4, 0.85))';
        }

        // Only mark active if no video slide exists and this is first image
        if (modalSlides.length === 0 && idx === 0) slide.classList.add('active');
        modalFrame.appendChild(slide);
        modalSlides.push(slide);

        const dot = document.createElement('div');
        dot.className = 'preview-dot';
        const dotIndex = slideIndex + idx;
        if (modalSlides.length === 1 && dotIndex === 0) dot.classList.add('active');
        dot.addEventListener('click', () => setSlide(dotIndex));
        modalDotsContainer.appendChild(dot);
        modalDots.push(dot);
    });

    // Hide navigation if only one slide
    const showNav = modalSlides.length > 1;
    if (modalPrev) modalPrev.style.display = showNav ? 'flex' : 'none';
    if (modalNext) modalNext.style.display = showNav ? 'flex' : 'none';
    modalDotsContainer.style.display = showNav ? 'flex' : 'none';
}

function setSlide(index) {
    if (!modalSlides.length) return;
    currentSlide = (index + modalSlides.length) % modalSlides.length;
    modalSlides.forEach((slide, i) => {
        const isActive = i === currentSlide;
        slide.classList.toggle('active', isActive);

        const vid = slide.querySelector('video');
        if (vid) {
            if (isActive) {
                // show thumbnail briefly if available, then play
                const thumb = slide.querySelector('.video-thumb');
                if (thumb) {
                    // ensure thumb visible then fade
                    try { thumb.style.opacity = '1'; } catch(e){}
                    // clear any previous timeout
                    if (slide._thumbTimeout) { clearTimeout(slide._thumbTimeout); slide._thumbTimeout = null; }
                    slide._thumbTimeout = setTimeout(() => {
                        try { thumb.style.opacity = '0'; } catch(e){}
                        const p = vid.play();
                        if (p && typeof p.catch === 'function') p.catch(() => {});
                        slide._thumbTimeout = null;
                    }, 800);
                } else {
                    vid.muted = true;
                    const p = vid.play();
                    if (p && typeof p.catch === 'function') p.catch(() => {});
                }
            } else {
                // clear any pending thumbnail timeouts
                try { if (slide._thumbTimeout) { clearTimeout(slide._thumbTimeout); slide._thumbTimeout = null; } } catch(e){}
                try { vid.pause(); vid.currentTime = 0; } catch (e) {}
                // hide thumb immediately if present
                try { const thumb = slide.querySelector('.video-thumb'); if (thumb) thumb.style.opacity = '0'; } catch(e){}
            }
        }
    });
    modalDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide(step = 1) {
    setSlide(currentSlide + step);
}

function openProjectModal({ title, description, tags, link, repo }) {
    if (!modal) return;

    modalTitle.textContent = title || 'Project';
    modalDesc.textContent = description || 'Details coming soon.';

    // Slides are built before open; ensure at least placeholder exists
    if (!modalSlides.length) {
        buildModalSlides('', title);
    }

    modalTags.innerHTML = '';
    if (tags) {
        tags.split(',').map(tag => tag.trim()).filter(Boolean).forEach(tag => {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = tag;
            modalTags.appendChild(badge);
        });
    }

    // Prefer repository link for the action button; fall back to media link
    if (repo && repo !== '#') {
        modalLink.href = repo;
        modalLink.style.display = 'inline-flex';
        try { modalLink.target = '_blank'; } catch(e){}
    } else if (link && link !== '#') {
        modalLink.href = link;
        modalLink.style.display = 'inline-flex';
        try { modalLink.target = '_self'; } catch(e){}
    } else {
        modalLink.href = '#';
        modalLink.style.display = 'none';
    }

    document.body.style.overflow = 'hidden';
    
    // Show loading screen before modal becomes visible
    showLoadingScreen();
    
    modal.classList.remove('hidden');
    
    // Trigger animation after display and ensure active slide (video) plays
    requestAnimationFrame(() => {
        modal.classList.add('show');
        
        // Wait for media to be ready before hiding loading screen
        const firstSlide = modalSlides[0];
        if (firstSlide) {
            const video = firstSlide.querySelector('video');
            const image = firstSlide.querySelector('img');
            
            if (video) {
                // For videos, wait for them to be ready to play
                if (video.readyState >= 3) {
                    // Video is already loaded, hide loading screen after animation
                    setTimeout(() => {
                        setSlide(currentSlide || 0);
                        hideLoadingScreen();
                    }, 600);
                } else {
                    // Wait for video to load
                    const onReady = () => {
                        setTimeout(() => {
                            setSlide(currentSlide || 0);
                            hideLoadingScreen();
                        }, 300);
                        video.removeEventListener('canplay', onReady);
                    };
                    video.addEventListener('canplay', onReady);
                    
                    // Fallback timeout in case video doesn't load
                    setTimeout(() => {
                        setSlide(currentSlide || 0);
                        hideLoadingScreen();
                    }, 3000);
                }
            } else if (image) {
                // For images, wait for them to load
                if (image.complete) {
                    setTimeout(() => {
                        setSlide(currentSlide || 0);
                        hideLoadingScreen();
                    }, 600);
                } else {
                    image.addEventListener('load', () => {
                        setTimeout(() => {
                            setSlide(currentSlide || 0);
                            hideLoadingScreen();
                        }, 300);
                    });
                    
                    // Fallback timeout
                    setTimeout(() => {
                        setSlide(currentSlide || 0);
                        hideLoadingScreen();
                    }, 3000);
                }
            } else {
                // No media, just hide after animation
                setTimeout(() => {
                    setSlide(currentSlide || 0);
                    hideLoadingScreen();
                }, 600);
            }
        } else {
            // No slides, hide loading screen after animation
            setTimeout(() => {
                hideLoadingScreen();
            }, 600);
        }
    });
}

function closeProjectModal() {
    if (!modal) return;
    
    modal.classList.remove('show');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        // pause any playing videos
        try {
            modal.querySelectorAll('video').forEach(v => { try { v.pause(); v.currentTime = 0; } catch(e){} });
        } catch(e) {}

        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

document.querySelectorAll('.view-project').forEach(button => {
    button.addEventListener('click', () => {
        const title = button.getAttribute('data-title');
        const description = button.getAttribute('data-description');
        const tags = button.getAttribute('data-tags');
            const link = button.getAttribute('data-link');
            const repo = button.getAttribute('data-repo');
            const images = button.getAttribute('data-images');
            buildModalSlides(images, title, link);
            openProjectModal({ title, description, tags, link, repo });
    });
});

if (modalPrev) modalPrev.addEventListener('click', () => nextSlide(-1));
if (modalNext) modalNext.addEventListener('click', () => nextSlide(1));

if (modalClose) modalClose.addEventListener('click', closeProjectModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeProjectModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeProjectModal();
    }
    if (e.key === 'ArrowRight' && modal && !modal.classList.contains('hidden')) {
        nextSlide(1);
    }
    if (e.key === 'ArrowLeft' && modal && !modal.classList.contains('hidden')) {
        nextSlide(-1);
    }
});

// ============= VIDEO & IMAGE PRELOADING =============
// Preload project videos and images when page loads for instant smooth opening
function preloadProjectMedia() {
    // Get all project buttons
    const projectButtons = document.querySelectorAll('.view-project');
    
    // Preload the first 3 projects (or all if less than 3)
    const projectsToPreload = Math.min(3, projectButtons.length);
    
    projectButtons.forEach((button, index) => {
        if (index < projectsToPreload) {
            // Preload videos
            const link = button.getAttribute('data-link');
            if (link && link.trim().toLowerCase().endsWith('.mp4')) {
                // Create and cache the video element
                if (!videoCache.has(link)) {
                    const video = document.createElement('video');
                    video.src = link;
                    video.preload = 'auto'; // Preload entire video
                    video.muted = true; // Mute during preload to avoid issues
                    video.loop = true;
                    video.playsInline = true;
                    
                    // Add to cache
                    videoCache.set(link, video);
                    
                    console.log(`Preloading video ${index + 1}:`, link);
                }
            }
            
            // Preload images
            const images = button.getAttribute('data-images');
            if (images) {
                const imageSources = images.split(',').map(s => s.trim()).filter(Boolean);
                
                // Preload all images for this project
                imageSources.forEach((src, imgIndex) => {
                    const img = new Image();
                    img.src = src;
                    console.log(`Preloading project ${index + 1} image ${imgIndex + 1}:`, src);
                });
            }
        }
    });
}

// Call preload function after page loads
window.addEventListener('load', () => {
    // Small delay to let page finish loading first
    setTimeout(preloadProjectMedia, 500);
});


// ============= FORM HANDLING =============
const dreamForm = document.querySelector('.dream-form');

if (dreamForm) {
    dreamForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(dreamForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Create essence particles effect
        createEssenceExplosion();
        
        // Simulate form submission
        setTimeout(() => {
            alert(`Dream received, ${name}. Your essence lingers in the void...`);
            dreamForm.reset();
        }, 1000);
        
        console.log('Form submitted:', { name, email, message });
    });
}

// ============= ESSENCE EXPLOSION EFFECT =============
function createEssenceExplosion() {
    const essenceContainer = document.querySelector('.essence-particles');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.background = 'radial-gradient(circle, #38bdf8 0%, transparent 70%)';
        particle.style.pointerEvents = 'none';
        particle.style.left = '50%';
        particle.style.top = '50%';
        
        const angle = (Math.PI * 2 * i) / 20;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        essenceContainer.appendChild(particle);
        
        let posX = 0;
        let posY = 0;
        let opacity = 1;
        
        const animate = () => {
            posX += vx * 0.016;
            posY += vy * 0.016;
            opacity -= 0.02;
            
            particle.style.transform = `translate(${posX}px, ${posY}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// ============= PARALLAX EFFECT =============
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const abyssSilhouette = document.querySelector('.abyss-silhouette');
    
    if (abyssSilhouette) {
        abyssSilhouette.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ============= ADDITIONAL ESSENCE PARTICLES =============
// Create more essence particles dynamically in the dream section
function createDreamParticles() {
    const essenceContainer = document.querySelector('.essence-particles');
    if (!essenceContainer) return;
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 6 + 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.background = 'radial-gradient(circle, #38bdf8 0%, transparent 70%)';
        particle.style.pointerEvents = 'none';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        essenceContainer.appendChild(particle);
        
        const duration = Math.random() * 3000 + 3000;
        const drift = (Math.random() - 0.5) * 100;
        
        particle.animate([
            { transform: 'translateY(0) translateX(0)', opacity: particle.style.opacity },
            { transform: `translateY(-800px) translateX(${drift}px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }, 2000);
}

createDreamParticles();

// ============= HERO SUBTITLE TEXT ROTATION =============
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const texts = [
        'Architect of Code & Worlds',
        'Game Programmer / Developer',
        'Technical Artist'        
    ];
    let currentIndex = 0;
    
    function rotateText() {
        // Fade out
        heroSubtitle.classList.add('fade-out');
        
        setTimeout(() => {
            // Change text
            currentIndex = (currentIndex + 1) % texts.length;
            heroSubtitle.textContent = texts[currentIndex];
            
            // Fade in
            heroSubtitle.classList.remove('fade-out');
        }, 600); // Wait for fade-out to complete
    }
    
    // Start rotation after 2 seconds initial delay 
    setTimeout(() => {
        rotateText();
        setInterval(rotateText, 3000);
    }, 2000);
}

// ============= LOADING ANIMATION =============
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============= CHARM BUTTON RIPPLE EFFECT =============
document.querySelectorAll('.charm-button, .dream-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(56, 189, 248, 0.5)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        
        this.appendChild(ripple);
        
        ripple.animate([
            { width: '0', height: '0', opacity: 1 },
            { width: '300px', height: '300px', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    });
});

// ============= CONSOLE EASTER EGG =============
console.log(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║      ECHOES OF HALLOWNEST            ║
    ║                                       ║
    ║      "No cost too great..."          ║
    ║                                       ║
    ║      Portfolio by Kivin               ║
    ║      Inspired by Hollow Knight        ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
`);

console.log('%c⚔ Welcome, Traveler. The Void watches... ⚔', 
    'color: #38bdf8; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px #38bdf8;');
