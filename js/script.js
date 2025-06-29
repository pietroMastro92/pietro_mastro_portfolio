// Enhanced JavaScript for Pietro Mastro's Portfolio
// Performance optimizations and modern features

// Theme toggle functionality with improved performance
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to determine theme based on user's local time
function getTimeBasedTheme() {
    const now = new Date();
    const currentHour = now.getHours();
    // Set dark mode between 7PM (19) and 7AM (7) based on user's local time zone
    console.log('Current hour:', currentHour, '- Current time:', now.toLocaleTimeString(), '- Time zone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
    // If it's between 7PM and 7AM in user's local time, return dark theme, otherwise light theme
    return (currentHour >= 19 || currentHour < 7) ? 'dark' : 'light';
}

// Check if user has manually set a theme preference
const userPreference = localStorage.getItem('userThemePreference');
// Check if there's a saved theme
const savedTheme = localStorage.getItem('theme');

// Function to update theme based on time
function updateThemeBasedOnTime() {
    // Only update automatically if user hasn't set a manual preference
    if (!userPreference) {
        const timeBasedTheme = getTimeBasedTheme();
        htmlElement.setAttribute('data-theme', timeBasedTheme);
        updateThemeIcon(timeBasedTheme);
        localStorage.setItem('theme', timeBasedTheme);
    }
}

if (savedTheme) {
    // Use saved theme if available
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
} else {
    // Otherwise use time-based theme
    updateThemeBasedOnTime();
}

// Check and update theme every hour
setInterval(updateThemeBasedOnTime, 60 * 60 * 1000);

// Toggle theme function
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    // Save that user has manually set a theme preference
    localStorage.setItem('userThemePreference', 'true');
    updateThemeIcon(newTheme);
}

// Update the icon based on current theme
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Add click event to theme toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize animations and performance optimizations
    initializeAnimations();
    initializeProgressBars();
    initializeLazyLoading();
    
    // Get all links in the sidebar
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    // Get all content sections
    const sections = document.querySelectorAll('.content-section');
    
    // Intersection Observer options - improved for better accuracy
    const observerOptions = {
        root: null, // viewport
        rootMargin: '-10% 0px -40% 0px', // more generous for shorter sections
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] // multiple thresholds for better detection
    };
    
    // Function to handle active link
    function setActiveLink(id) {
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to link corresponding to active section
        const activeLink = document.querySelector(`.sidebar-nav a[href="#${id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Create Intersection Observer with improved logic
    const observer = new IntersectionObserver((entries) => {
        // Sort entries by their position on the page (top to bottom)
        const sortedEntries = entries.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top;
        });
        
        // Find the section that's most prominently visible
        let activeSection = null;
        let maxVisibilityRatio = 0;
        
        for (const entry of sortedEntries) {
            if (entry.isIntersecting) {
                // For shorter sections (like CV and Contact), be more generous
                const rect = entry.boundingClientRect;
                const viewportHeight = window.innerHeight;
                
                // Calculate how much of the section is visible
                const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
                const sectionHeight = rect.height;
                const visibilityRatio = visibleHeight / Math.min(sectionHeight, viewportHeight * 0.5);
                
                if (visibilityRatio > maxVisibilityRatio) {
                    maxVisibilityRatio = visibilityRatio;
                    activeSection = entry.target;
                }
            }
        }
        
        // If we found an active section, highlight it
        if (activeSection) {
            setActiveLink(activeSection.id);
        }
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
        // Ensure all sections have the content-section class for proper detection
        if (!section.classList.contains('content-section')) {
            section.classList.add('content-section');
        }
    });
    
    // Handle smooth scroll when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                // Immediately set active state for clicked link
                setActiveLink(targetId);
                
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // On mobile, close sidebar after clicking a link
                if (window.innerWidth <= 768 || (window.innerWidth <= 932 && window.innerHeight < 500)) {
                    const sidebar = document.querySelector('.sidebar');
                    sidebar.classList.remove('visible');
                    sidebarIcon.className = 'fas fa-bars';
                    localStorage.setItem('sidebarVisible', 'false');
                }
            }
        });
    });
    
    // Improved scroll fallback for better accuracy
    function handleInitialState() {
        let activeSection = null;
        let bestScore = -1;
        
        // Find section that best fits our criteria
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            
            // Check if section is visible
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                // Calculate a score based on position and visibility
                const viewportHeight = window.innerHeight;
                const sectionHeight = rect.height;
                
                // Prefer sections that are in the upper portion of viewport
                const topScore = Math.max(0, 1 - Math.abs(rect.top) / (viewportHeight * 0.4));
                
                // For very short sections (like CV/Contact), give bonus if they're well-positioned
                const shortSectionBonus = sectionHeight < viewportHeight * 0.3 ? 0.3 : 0;
                
                // Calculate visibility ratio
                const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
                const visibilityScore = visibleHeight / Math.min(sectionHeight, viewportHeight * 0.6);
                
                const totalScore = topScore + visibilityScore + shortSectionBonus;
                
                if (totalScore > bestScore) {
                    bestScore = totalScore;
                    activeSection = section;
                }
            }
        }
        
        // Set active section if found
        if (activeSection) {
            setActiveLink(activeSection.id);
        }
    }
    
    // Apply initial state
    handleInitialState();
    
    // Handle manual scroll in case Intersection Observer isn't sufficient
    window.addEventListener('scroll', function() {
        // Use throttle to avoid overloading with too many scroll events
        if (!window.requestAnimationFrame) {
            // For older browsers
            setTimeout(handleInitialState, 300);
        } else {
            requestAnimationFrame(handleInitialState);
        }
    }, { passive: true });
    
    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarContents = document.getElementById('sidebar-contents');
    const sidebarIcon = document.getElementById('sidebar-icon');

    // Function to handle sidebar visibility based on screen size
    function handleSidebarVisibility() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        // Check if we're in a constrained viewport (width less than 935px)
        const isConstrainedViewport = window.innerWidth < 935;
        
        if (isConstrainedViewport) {
            // Show the floating toggle button
            sidebarToggle.style.display = 'flex';
            
            // Check if sidebar should be visible based on saved preference
            const sidebarVisible = localStorage.getItem('sidebarVisible') === 'true';
            
            // Ensure sidebar is properly hidden by default on mobile
            sidebar.style.transform = sidebarVisible ? 'translateY(0)' : 'translateY(100%)';
            
            if (sidebarVisible) {
                sidebar.classList.add('visible');
                sidebarIcon.className = 'fas fa-times';
            } else {
                sidebar.classList.remove('visible');
                sidebarIcon.className = 'fas fa-bars';
            }
        } else {
            // On desktop with sufficient space, hide the floating toggle button and always show sidebar normally
            sidebarToggle.style.display = 'none';
            // Make sure sidebar is visible on desktop and reset any transform
            sidebar.style.transform = '';
            sidebar.classList.remove('visible');
        }
    }

    // Toggle sidebar function
    function toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const isVisible = sidebar.classList.contains('visible');
        
        if (isVisible) {
            sidebar.classList.remove('visible');
            sidebar.style.transform = 'translateY(100%)';
            sidebarIcon.className = 'fas fa-bars';
            localStorage.setItem('sidebarVisible', 'false');
        } else {
            sidebar.classList.add('visible');
            sidebar.style.transform = 'translateY(0)';
            sidebarIcon.className = 'fas fa-times';
            localStorage.setItem('sidebarVisible', 'true');
        }
    }

    // Add click event to sidebar toggle button
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Handle initial state and resize events
    window.addEventListener('resize', debounce(handleSidebarVisibility, 250));
    
    // Initialize sidebar visibility
    handleSidebarVisibility();
});

// Modern animation and performance enhancements
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px'
    });

    // Apply fade-in animation to cards and sections
    const animatedElements = document.querySelectorAll('.skill-card, .content-section, .profile-header, .contact-form-container');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
        animationObserver.observe(el);
    });
}

function initializeProgressBars() {
    // Animate progress bars when they come into view
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                if (progressFill) {
                    const width = progressFill.getAttribute('data-width') || progressFill.style.width;
                    progressFill.style.width = '0%';
                    setTimeout(() => {
                        progressFill.style.width = width;
                    }, 100);
                }
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-card').forEach(card => {
        progressObserver.observe(card);
    });
}

function initializeLazyLoading() {
    // Lazy load images for better performance
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Enhanced scroll performance
let ticking = false;
function updateOnScroll() {
    // Parallax effect for background elements
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.wavy-background');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}, { passive: true });

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        '/images/profile.jpg',
        '/images/background.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadCriticalResources();
