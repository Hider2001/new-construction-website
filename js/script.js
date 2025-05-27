// Preloader
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.querySelector('.preloader');
    
    // Check if preloader exists
    if (!preloader) return;
    
    // Hide preloader after page loads
    setTimeout(() => {
        preloader.classList.add('fade-out');
        
        // Enable scroll after preloader disappears
        setTimeout(() => {
            document.body.style.overflow = 'auto';
            
            // Start animations after preloader
            startInitialAnimations();
        }, 500);
    }, 1500);
    
    // Disable scroll during preloader
    document.body.style.overflow = 'hidden';
});

// Initial animations
function startInitialAnimations() {
    // Animate section titles that are initially visible
    const visibleTitles = Array.from(document.querySelectorAll('.section-title')).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight;
    });
    
    visibleTitles.forEach(title => title.classList.add('animate'));
    
    // Trigger other initial animations
    animateElementsInView();
}

// Trigger animations when scrolling to a specific section
function startInitialAnimationsOnScroll() {
    const sections = document.querySelectorAll('.section-title');

    // Use IntersectionObserver to detect when sections come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add the 'animate' class to the section title
                entry.target.classList.add('animate');

                // Trigger other animations for elements in the section
                animateElementsInView();

                // Stop observing the section once it's animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the section is visible
    });

    // Observe each section title
    sections.forEach((section) => observer.observe(section));
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    startInitialAnimationsOnScroll();
});

// Header Section JavaScript
const header = document.querySelector('.header');
const header_mobileToggle = document.querySelector('.header__mobile-toggle');
const header_nav = document.querySelector('.header__nav');
const header_navLinks = document.querySelectorAll('.header__nav-link');

// Check if header elements exist before adding event listeners
if (header_mobileToggle && header_nav) {
    header_mobileToggle.addEventListener('click', () => {
        header_nav.classList.toggle('active');
        header_mobileToggle.classList.toggle('active');
        
        // Change icon
        const icon = header_mobileToggle.querySelector('i');
        if (icon) {
            if (header_nav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        }
    });
}

// Active link highlighting and header styling on scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const scrollPos = window.scrollY;
    
        // Header styling
        if (header) {
            if (scrollPos > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Go to top button visibility
        const goTopBtn = document.getElementById('goTop');
        if (goTopBtn) {
            if (scrollPos > 300) {
                goTopBtn.classList.add('active');
            } else {
                goTopBtn.classList.remove('active');
            }
        }
        
        // Active link highlighting
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                header_navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Animate elements as they come into view
        animateElementsInView();
    }, 100);
});

// Close mobile menu when clicking a nav link
header_navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (header_nav && header_mobileToggle) {
            header_nav.classList.remove('active');
            header_mobileToggle.classList.remove('active');
            
            const icon = header_mobileToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    });
});

// Smooth scrolling for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Projects Section
const projectFilterBtns = document.querySelectorAll('.projects__filter-btn');
const projectItems = document.querySelectorAll('.projects__item');
const projectModal = document.getElementById('projectModal');
const projectModalClose = document.querySelector('.projects__modal-close');
const projectLinks = document.querySelectorAll('.projects__item-link');

// Filter projects
projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Activate current button
        projectFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter projects
        const filterValue = btn.getAttribute('data-filter');
        
        projectItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Modal functionality
if (projectLinks.length > 0 && projectModal) {
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const projectItem = this.closest('.projects__item');
            if (!projectItem) return;
            
            const modalTitle = document.querySelector('.projects__modal-title');
            const modalCategory = document.querySelector('.projects__modal-category');
            
            if (modalTitle && modalCategory) {
                const itemTitle = projectItem.querySelector('.projects__item-title');
                const itemCategory = projectItem.querySelector('.projects__item-category');
                
                if (itemTitle) modalTitle.textContent = itemTitle.textContent;
                if (itemCategory) modalCategory.textContent = itemCategory.textContent;
            }
            
            // Show modal
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    if (projectModalClose) {
        projectModalClose.addEventListener('click', () => {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside content
    projectModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Testimonials Slider
class TestimonialsSlider {
    constructor() {
        this.track = document.getElementById('testimonialTrack');
        this.slides = document.querySelectorAll('.testimonials__slide');
        this.dots = document.querySelectorAll('.testimonials__dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;
        this.progressInterval = null;
        this.autoplayDelay = 5000;
        this.isPlaying = true;
        this.progressWidth = 0;
        
        this.init();
    }
    
    init() {
        if (this.totalSlides === 0) return;
        
        this.bindEvents();
        this.updateSlider();
        this.startAutoplay();
    }
    
    bindEvents() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.goToPrevSlide());
        this.nextBtn?.addEventListener('click', () => this.goToNextSlide());
        
        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.testimonials')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.goToNextSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.goToPrevSlide();
                        break;
                }
            }
        });
        
        // Pause/resume on hover
        const slider = document.querySelector('.testimonials__slider');
        slider?.addEventListener('mouseenter', () => this.pauseAutoplay());
        slider?.addEventListener('mouseleave', () => this.resumeAutoplay());
        
        // Pause on focus
        slider?.addEventListener('focusin', () => this.pauseAutoplay());
        slider?.addEventListener('focusout', () => this.resumeAutoplay());
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.resumeAutoplay();
            }
        });
        
        // Handle reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.pauseAutoplay();
        }
    }
    
    updateSlider() {
        // Remove active class from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'fade-in');
        });
        
        // Add active class to current slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active', 'fade-in');
        }
        
        // Update track position
        const translateX = this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            const isActive = index === this.currentSlide;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive.toString());
        });
        
        // Update navigation buttons
        this.prevBtn.disabled = false;
        this.nextBtn.disabled = false;
        
        // Announce to screen readers
        const currentCard = this.slides[this.currentSlide]?.querySelector('.testimonials__card');
        if (currentCard) {
            currentCard.setAttribute('aria-live', 'polite');
            setTimeout(() => currentCard.removeAttribute('aria-live'), 1000);
        }
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides && index !== this.currentSlide) {
            this.currentSlide = index;
            this.updateSlider();
            this.restartAutoplay();
        }
    }
    
    goToNextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    goToPrevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
        if (!this.isPlaying) return;
        
        this.progressWidth = 0;
        this.updateProgressBar();
        
        this.autoplayInterval = setInterval(() => {
            this.goToNextSlide();
        }, this.autoplayDelay);
        
        this.startProgressUpdate();
    }
    
    startProgressUpdate() {
        this.progressInterval = setInterval(() => {
            if (this.progressWidth >= 100) {
                this.progressWidth = 0;
            } else {
                this.progressWidth += (100 / (this.autoplayDelay / 50));
            }
            this.updateProgressBar();
        }, 50);
    }
    
    updateProgressBar() {
        if (this.progressBar) {
            this.progressBar.style.width = `${Math.min(this.progressWidth, 100)}%`;
        }
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    resumeAutoplay() {
        if (this.isPlaying && !this.autoplayInterval) {
            this.startAutoplay();
        }
    }
    
    restartAutoplay() {
        this.pauseAutoplay();
        this.startAutoplay();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsSlider();
});

// Animated counters in About section
function animateCounters() {
    const counters = document.querySelectorAll('.animated-counter:not(.counted)');
    
    counters.forEach(counter => {
        counter.classList.add('counted');
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const duration = 2000; // Animation duration in ms
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        const increment = target / totalFrames;
        
        const updateCount = () => {
            count += increment;
            
            if (count < target) {
                counter.innerText = Math.ceil(count);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCount();
    });
}

// Animate elements when they come into view
function animateElementsInView() {
    // Elements to animate
    const elements = document.querySelectorAll(
        '.section-title:not(.animated), .services__card:not(.animated), ' +
        '.projects__item:not(.animated), .about__feature:not(.animated), ' +
        '.about__stat-item:not(.animated), .timeline__item:not(.animated), ' +
        '.team__member:not(.animated), .testimonials__card:not(.animated), ' +
        '.contact__info-item:not(.animated), .badge:not(.animated), ' +
        '.about__image-wrapper:not(.animated), .about__content:not(.animated),' +
        '.contact__form-container:not(.animated), .contact__info:not(.animated)'
    );

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

        // Add the 'animated' class if the element is in the viewport
        if (isVisible) {
            el.classList.add('animated');

            // Start counter animation for stats
            if (el.classList.contains('about__stat-item')) {
                animateCounters();
            }
        }
    });
}

// Contact form validation
const contactForm = document.querySelector('.contact__form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        let isValid = true;
        
        if (name && name.value.trim() === '') {
            highlightError(name);
            isValid = false;
        } else if (name) {
            removeError(name);
        }
        
        if (email && (email.value.trim() === '' || !isValidEmail(email.value))) {
            highlightError(email);
            isValid = false;
        } else if (email) {
            removeError(email);
        }
        
        if (message && message.value.trim() === '') {
            highlightError(message);
            isValid = false;
        } else if (message) {
            removeError(message);
        }
        
        if (isValid) {
            // Submit the form or show success message
            alert('تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.');
            contactForm.reset();
        }
    });
}

function highlightError(element) {
    element.classList.add('error');
}

function removeError(element) {
    element.classList.remove('error');
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Newsletter form submission
const newsletterForm = document.querySelector('.footer__newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        
        if (emailInput && (emailInput.value.trim() === '' || !isValidEmail(emailInput.value))) {
            emailInput.classList.add('error');
        } else if (emailInput) {
            emailInput.classList.remove('error');
            alert('شكرًا لاشتراكك في نشرتنا الإخبارية!');
            newsletterForm.reset();
        }
    });
}

// Initialize animations when DOM is loaded
window.addEventListener('load', function() {
    // Trigger animations for elements in initial view
    animateElementsInView();
    document.body.style.overflow = 'auto';
});