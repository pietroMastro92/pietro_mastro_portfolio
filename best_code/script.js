// Theme toggling functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

// Check local storage for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

// Toggle theme function
function toggleTheme() {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
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
themeToggle.addEventListener('click', toggleTheme);

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
              // Scroll to section with smooth animation
              targetSection.scrollIntoView({
                  behavior: 'smooth'
              });
              
              // Set link as active
              setActiveLink(targetId);
              
              // On mobile, close sidebar after clicking a link
              if (window.innerWidth <= 768) {
                  sidebarContents.classList.add('hidden');
                  sidebarIcon.className = 'fas fa-bars';
                  localStorage.setItem('sidebarHidden', 'true');
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
      // If we're on mobile (screen width <= 768px)
      if (window.innerWidth <= 768) {
          // Check if sidebar should be hidden based on saved preference
          const sidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
          
          if (sidebarHidden) {
              sidebarContents.classList.add('hidden');
              sidebarIcon.className = 'fas fa-bars';
          } else {
              sidebarContents.classList.remove('hidden');
              sidebarIcon.className = 'fas fa-times';
          }
      } else {
          // On desktop, always show sidebar
          sidebarContents.classList.remove('hidden');
      }
  }

  // Toggle sidebar function
  function toggleSidebar() {
      const isHidden = sidebarContents.classList.contains('hidden');
      
      if (isHidden) {
          sidebarContents.classList.remove('hidden');
          sidebarIcon.className = 'fas fa-times';
          localStorage.setItem('sidebarHidden', 'false');
      } else {
          sidebarContents.classList.add('hidden');
          sidebarIcon.className = 'fas fa-bars';
          localStorage.setItem('sidebarHidden', 'true');
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

