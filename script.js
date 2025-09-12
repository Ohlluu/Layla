// ===== LAYLA NOELLE KUCK PORTFOLIO - ADVANCED JAVASCRIPT =====
// Musical Theatre Portfolio with Pink Theme & Mobile-First Design

// ===== CONFIGURATION =====
const CONFIG = {
    ANIMATION_DURATION: {
        fast: 200,
        normal: 300,
        slow: 600
    },
    
    OBSERVER_OPTIONS: {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.1
    },
    
    THROTTLE_DELAY: 16,
    DEBOUNCE_DELAY: 300
};

// ===== UTILITY FUNCTIONS =====
class Utils {
    static throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    static scrollTo(element, offset = 0) {
        const elementTop = element.offsetTop - offset;
        window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
        });
    }
    
    static animate(element, properties, duration = CONFIG.ANIMATION_DURATION.normal) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const startValues = {};
            
            for (const prop in properties) {
                startValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
            }
            
            function updateAnimation(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                for (const prop in properties) {
                    const start = startValues[prop];
                    const end = properties[prop];
                    const current = start + (end - start) * easeOut;
                    
                    if (prop === 'opacity') {
                        element.style.opacity = current;
                    } else if (prop === 'transform') {
                        element.style.transform = `translateY(${current}px)`;
                    }
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateAnimation);
                } else {
                    resolve();
                }
            }
            
            requestAnimationFrame(updateAnimation);
        });
    }
}

// ===== LOADING SCREEN MANAGER =====
class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.isLoaded = false;
    }
    
    init() {
        // Hide loading screen when everything is loaded
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 1000);
        });
        
        // Fallback: hide after 3 seconds
        setTimeout(() => {
            if (!this.isLoaded) this.hide();
        }, 3000);
    }
    
    hide() {
        if (this.isLoaded) return;
        this.isLoaded = true;
        
        this.loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'visible';
        
        setTimeout(() => {
            if (this.loadingScreen && this.loadingScreen.parentNode) {
                this.loadingScreen.remove();
            }
        }, 500);
    }
}

// ===== NAVIGATION MANAGER =====
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('nav-menu');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveSection();
    }
    
    setupScrollEffect() {
        const handleScroll = Utils.throttle(() => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, CONFIG.THROTTLE_DELAY);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    setupMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.navMenu.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.toggleMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        
        // Animate hamburger bars
        const spans = this.hamburger.querySelectorAll('span');
        if (this.isMenuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : 'visible';
    }
    
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    Utils.scrollTo(targetElement, 80);
                }
            });
        });
    }
    
    setupActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        
        const handleScroll = Utils.throttle(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, CONFIG.THROTTLE_DELAY);
        
        window.addEventListener('scroll', handleScroll);
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, CONFIG.OBSERVER_OPTIONS);
    }
    
    observeElements() {
        const elementsToAnimate = document.querySelectorAll(`
            .story-section,
            .skill-category,
            .resume-item,
            .video-item,
            .contact-card,
            .award-item
        `);
        
        // Animate gallery items but preserve image visibility
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(60px)';
            element.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
            // Ensure images within gallery items remain visible
            const img = element.querySelector('img');
            if (img) {
                img.style.opacity = '1';
            }
            this.observer.observe(element);
        });
        
        elementsToAnimate.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(60px)';
            element.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
            this.observer.observe(element);
        });
    }
    
    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
}

// ===== FORM HANDLER =====
class FormHandler {
    constructor() {
        this.contactForm = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                this.handleSubmit(e);
            });
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData);
        
        if (!this.validateForm(data)) {
            return;
        }
        
        this.showLoadingState();
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            this.showSuccessMessage();
            this.contactForm.reset();
        }, 2000);
    }
    
    validateForm(data) {
        if (!data.name || !data.email || !data.message) {
            this.showError('Please fill in all required fields.');
            return false;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showError('Please enter a valid email address.');
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showLoadingState() {
        const submitButton = this.contactForm.querySelector('.form-submit');
        const originalText = submitButton.querySelector('.btn-text').textContent;
        
        submitButton.disabled = true;
        submitButton.querySelector('.btn-text').textContent = 'Sending...';
        submitButton.style.opacity = '0.7';
        
        // Store original text for restoration
        submitButton.dataset.originalText = originalText;
    }
    
    showSuccessMessage() {
        const submitButton = this.contactForm.querySelector('.form-submit');
        const originalText = submitButton.dataset.originalText;
        
        submitButton.disabled = false;
        submitButton.querySelector('.btn-text').textContent = 'Message Sent! 🎭';
        submitButton.style.background = 'linear-gradient(135deg, #10B981 0%, #34D399 100%)';
        
        setTimeout(() => {
            submitButton.querySelector('.btn-text').textContent = originalText;
            submitButton.style.background = '';
            submitButton.style.opacity = '';
        }, 3000);
    }
    
    showError(message) {
        let errorElement = this.contactForm.querySelector('.form-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.style.cssText = `
                color: #EF4444;
                background: rgba(239, 68, 68, 0.1);
                padding: 12px 16px;
                border-radius: 12px;
                margin-bottom: 16px;
                font-size: 14px;
                border: 1px solid rgba(239, 68, 68, 0.3);
                animation: shake 0.5s ease-in-out;
            `;
            this.contactForm.insertBefore(errorElement, this.contactForm.firstChild);
        }
        
        errorElement.textContent = message;
        
        // Add shake animation
        const shakeKeyframes = `
            @keyframes shake {
                0%, 20%, 40%, 60%, 80% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            }
        `;
        
        if (!document.querySelector('#shake-animation')) {
            const style = document.createElement('style');
            style.id = 'shake-animation';
            style.textContent = shakeKeyframes;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }
}

// ===== GALLERY INTERACTIONS =====
class GalleryManager {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.init();
    }
    
    init() {
        this.setupGalleryHover();
    }
    
    setupGalleryHover() {
        this.galleryItems.forEach(item => {
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay');
            
            item.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.1) rotate(2deg)';
                overlay.style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
                overlay.style.opacity = '0';
            });
        });
    }
}

// ===== VIDEO MANAGER =====
class VideoManager {
    constructor() {
        this.videos = document.querySelectorAll('video');
        this.init();
    }
    
    init() {
        this.setupVideoControls();
        this.setupLazyLoading();
    }
    
    setupVideoControls() {
        this.videos.forEach(video => {
            // Pause other videos when one starts playing
            video.addEventListener('play', () => {
                this.videos.forEach(otherVideo => {
                    if (otherVideo !== video) {
                        otherVideo.pause();
                    }
                });
            });
            
            // Add custom play button overlay
            const container = video.parentElement;
            const playButton = document.createElement('button');
            playButton.className = 'video-play-button';
            playButton.innerHTML = '▶️';
            playButton.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(233, 30, 99, 0.9);
                color: white;
                border: none;
                border-radius: 50%;
                width: 80px;
                height: 80px;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 2;
            `;
            
            container.style.position = 'relative';
            container.appendChild(playButton);
            
            playButton.addEventListener('click', () => {
                video.play();
                playButton.style.display = 'none';
            });
            
            video.addEventListener('pause', () => {
                playButton.style.display = 'block';
            });
            
            playButton.addEventListener('mouseenter', () => {
                playButton.style.transform = 'translate(-50%, -50%) scale(1.1)';
                playButton.style.background = 'rgba(233, 30, 99, 1)';
            });
            
            playButton.addEventListener('mouseleave', () => {
                playButton.style.transform = 'translate(-50%, -50%) scale(1)';
                playButton.style.background = 'rgba(233, 30, 99, 0.9)';
            });
        });
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        video.load();
                        videoObserver.unobserve(video);
                    }
                });
            });
            
            this.videos.forEach(video => {
                videoObserver.observe(video);
            });
        }
    }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        this.monitorPageLoad();
        this.setupImageOptimization();
    }
    
    monitorPageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                console.log(`🎭 Page loaded in ${loadTime}ms`);
            }
            
            if ('PerformanceObserver' in window) {
                this.trackWebVitals();
            }
        });
    }
    
    trackWebVitals() {
        // Track Largest Contentful Paint
        try {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('LCP tracking not supported');
        }
        
        // Track First Input Delay
        try {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.log('FID tracking not supported');
        }
    }
    
    setupImageOptimization() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Add fade-in effect
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.3s ease';
                        
                        img.addEventListener('load', () => {
                            img.style.opacity = '1';
                        });
                        
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
}

// ===== MUSICAL THEATRE THEME EFFECTS =====
class TheatreEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.createSparkleEffect();
        this.setupHoverEffects();
        this.createCurtainEffect();
    }
    
    createSparkleEffect() {
        // Add sparkles around the hero image
        const heroVisual = document.querySelector('.hero-visual');
        if (!heroVisual) return;
        
        setInterval(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: absolute;
                pointer-events: none;
                font-size: ${Math.random() * 20 + 15}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: sparkleFloat 3s ease-out forwards;
                z-index: 1;
            `;
            
            heroVisual.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 3000);
        }, 2000);
        
        // Add sparkle animation CSS
        if (!document.querySelector('#sparkle-animation')) {
            const style = document.createElement('style');
            style.id = 'sparkle-animation';
            style.textContent = `
                @keyframes sparkleFloat {
                    0% {
                        opacity: 0;
                        transform: translateY(0) scale(0);
                    }
                    20% {
                        opacity: 1;
                        transform: translateY(-20px) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-100px) scale(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupHoverEffects() {
        // Add theatre-themed hover effects to buttons
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createButtonSparkles(e.target);
            });
        });
    }
    
    createButtonSparkles(button) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('span');
                sparkle.innerHTML = '🎭';
                sparkle.style.cssText = `
                    position: absolute;
                    pointer-events: none;
                    font-size: 16px;
                    left: ${Math.random() * button.offsetWidth}px;
                    top: ${Math.random() * button.offsetHeight}px;
                    animation: buttonSparkle 1s ease-out forwards;
                    z-index: 10;
                `;
                
                button.style.position = 'relative';
                button.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 1000);
            }, i * 100);
        }
        
        // Add button sparkle animation CSS
        if (!document.querySelector('#button-sparkle-animation')) {
            const style = document.createElement('style');
            style.id = 'button-sparkle-animation';
            style.textContent = `
                @keyframes buttonSparkle {
                    0% {
                        opacity: 1;
                        transform: scale(0) rotate(0deg);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.2) rotate(180deg);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0) rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createCurtainEffect() {
        // Add subtle curtain-like effect to section transitions
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            section.addEventListener('mouseenter', () => {
                section.style.transform = 'scale(1.01)';
                section.style.transition = 'transform 0.3s ease';
            });
            
            section.addEventListener('mouseleave', () => {
                section.style.transform = 'scale(1)';
            });
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎭 Layla Noelle Kuck Portfolio - Initializing...');
    
    // Initialize all components
    const loadingScreen = new LoadingScreen();
    const navigation = new Navigation();
    const scrollAnimations = new ScrollAnimations();
    const formHandler = new FormHandler();
    const galleryManager = new GalleryManager();
    const videoManager = new VideoManager();
    const performanceMonitor = new PerformanceMonitor();
    const theatreEffects = new TheatreEffects();
    
    // Initialize loading screen
    loadingScreen.init();
    
    console.log('✨ Portfolio initialized successfully!');
    
    // Add theatre-themed console message
    console.log(`
    🎭 Welcome to Layla's Musical Theatre Portfolio!
    
    ✨ Features:
    - Elegant pink theme with rose gold accents
    - Mobile-first responsive design
    - Interactive photo and video galleries
    - Smooth scroll animations
    - Professional resume section
    - Contact form with validation
    
    🌟 Built with passion for the performing arts!
    `);
});

// ===== EASTER EGGS =====
// Add some fun theatre-themed easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code for theatre mode
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    if (!window.konamiIndex) window.konamiIndex = 0;
    
    if (e.code === konamiCode[window.konamiIndex]) {
        window.konamiIndex++;
        if (window.konamiIndex === konamiCode.length) {
            // Activate theatre mode
            document.body.style.animation = 'theatreMode 3s ease-in-out';
            console.log('🎭 Theatre Mode Activated!');
            
            // Add special theatre mode animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes theatreMode {
                    0% { filter: sepia(0) hue-rotate(0deg); }
                    50% { filter: sepia(1) hue-rotate(320deg); }
                    100% { filter: sepia(0) hue-rotate(0deg); }
                }
            `;
            document.head.appendChild(style);
            
            window.konamiIndex = 0;
        }
    } else {
        window.konamiIndex = 0;
    }
});