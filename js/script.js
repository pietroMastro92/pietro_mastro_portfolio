// Custom JavaScript for Pietro Mastro's Portfolio

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

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
    
    // Get all links in the sidebar
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    // Get all content sections
    const sections = document.querySelectorAll('.content-section');
    
    // Intersection Observer options
    const observerOptions = {
        root: null, // viewport
        rootMargin: '-5% 0px -75% 0px', // consider section "active" when in upper part of viewport
        threshold: 0 // trigger when any part of section is visible
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
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        // Filter only visible sections
        const visibleSections = entries.filter(entry => entry.isIntersecting);
        
        // If there's at least one visible section
        if (visibleSections.length > 0) {
            // Take the first visible section (topmost in the page)
            const topSection = visibleSections.reduce((prev, current) => {
                return prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current;
            });
            
            setActiveLink(topSection.target.id);
        }
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Handle smooth scroll when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
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
    
    // Handle initial state on page load
    function handleInitialState() {
        // Find first visible section
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            
            // If section is in viewport
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
                setActiveLink(section.id);
                break;
            }
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
    window.addEventListener('resize', handleSidebarVisibility);
    
    // Initialize sidebar visibility
    handleSidebarVisibility();
});
