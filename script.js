// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe timeline items and project cards
document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

// Smooth scrolling for navigation links
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    }
});

// Text animation for hero title
const heroLines = document.querySelectorAll('.hero-title .line');
heroLines.forEach((line, index) => {
    line.style.animationDelay = `${0.5 + index * 0.2}s`;
});

// Page load animations
window.addEventListener('load', () => {
    // Trigger entrance animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Add loading state
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading if present
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimized scroll handler
const handleScroll = debounce(() => {
    const scrolled = window.pageYOffset;
    
    // Update navbar
    const navbar = document.querySelector('.navbar');
    navbar.style.background = scrolled > 100 ? 'rgba(15, 23, 42, 0.98)' : 'rgba(15, 23, 42, 0.95)';
}, 16);

window.addEventListener('scroll', handleScroll);