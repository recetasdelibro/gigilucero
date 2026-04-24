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

// Load product data from feria.json
async function loadProductData() {
    try {
        const response = await fetch('../assets/feria.json');
        const products = await response.json();
        
        // Get product ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id')) || 1;
        
        // Find the product
        const product = products.find(p => p.id === productId);
        
        if (product) {
            displayProduct(product);
        } else {
            document.querySelector('.content').innerHTML = '<p>Producto no encontrado</p>';
        }
    } catch (error) {
        console.error('Error loading product data:', error);
        document.querySelector('.content').innerHTML = '<p>Error al cargar el producto</p>';
    }
}

// Display product information
function displayProduct(product) {
    const contentDiv = document.querySelector('.content');
    
    // Create array of all images: main image + slide images
    const allImages = [product.image_path];
    if (product.image_slide && product.path) {
        product.image_slide.forEach(slideImage => {
            allImages.push(product.path + slideImage);
        });
    }
    
    // Add "../" prefix to all paths
    const imagePaths = allImages.map(path => "../" + path);
    
    contentDiv.innerHTML = `
        <div class="product-detail">
            <h1>${product.title}</h1>
            <div class="product-image-container">
                <div class="image-slider">
                    <button class="slider-btn prev-btn" onclick="changeSlide(-1)">&#10094;</button>
                    <div class="slider-container">
                        ${imagePaths.map((path, index) => `
                            <img src="${path}" alt="${product.title}" class="slider-image ${index === 0 ? 'active' : ''}" data-index="${index}">
                        `).join('')}
                    </div>
                    <button class="slider-btn next-btn" onclick="changeSlide(1)">&#10095;</button>
                    <div class="slider-dots">
                        ${imagePaths.map((_, index) => `
                            <span class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></span>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="product-info">
                <span class="product-size">${product.size ? 'talle ' + product.size : ''}</span>
                <p class="product-price">$${product.price.toLocaleString()}</p>
            </div>
        </div>
    `;
    
    // Initialize slider
    initSlider();
}

// Initialize product page
if (window.location.pathname.includes('producto_feria.html')) {
    document.addEventListener('DOMContentLoaded', loadProductData);
}

// Slider functionality
let currentSlide = 0;
let sliderInterval;

function initSlider() {
    const images = document.querySelectorAll('.slider-image');
    if (images.length > 1) {
        // Auto-slide every 5 seconds
        sliderInterval = setInterval(() => changeSlide(1), 5000);
        
        // Add swipe functionality for mobile
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, false);
            
            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);
            
            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe left - next slide
                        changeSlide(1);
                    } else {
                        // Swipe right - previous slide
                        changeSlide(-1);
                    }
                }
            }
        }
    }
}

function changeSlide(direction) {
    const images = document.querySelectorAll('.slider-image');
    if (images.length === 0) return;
    
    // Remove active class from current image
    images[currentSlide].classList.remove('active');
    
    // Calculate new slide index
    currentSlide += direction;
    if (currentSlide >= images.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = images.length - 1;
    }
    
    // Add active class to new image
    images[currentSlide].classList.add('active');
    
    // Update dots
    updateDots();
    
    // Reset auto-slide timer
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => changeSlide(1), 5000);
}

function goToSlide(index) {
    const images = document.querySelectorAll('.slider-image');
    if (images.length === 0) return;
    
    // Remove active class from current image
    images[currentSlide].classList.remove('active');
    
    // Set new slide index
    currentSlide = index;
    
    // Add active class to new image
    images[currentSlide].classList.add('active');
    
    // Update dots
    updateDots();
    
    // Reset auto-slide timer
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => changeSlide(1), 5000);
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}
