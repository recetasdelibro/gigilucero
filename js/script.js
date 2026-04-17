// Navigation menu functionality
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const body = document.body;
    
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        body.style.overflow = '';
        body.style.position = '';
        setTimeout(() => {
            if (!navMenu.classList.contains('active')) {
                navMenu.style.display = 'none';
            }
        }, 300);
    } else {
        navMenu.style.display = 'block';
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.width = '100%';
        setTimeout(() => {
            navMenu.classList.add('active');
        }, 10);
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        setTimeout(() => {
            if (!navMenu.classList.contains('active')) {
                navMenu.style.display = 'none';
            }
        }, 300);
    }
});

// Prevent scrolling when menu is open on touch devices
document.addEventListener('touchmove', function(event) {
    const navMenu = document.getElementById('navMenu');
    if (navMenu.classList.contains('active') && !navMenu.contains(event.target)) {
        event.preventDefault();
    }
}, { passive: false });

// Handle escape key to close menu
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    }
});
