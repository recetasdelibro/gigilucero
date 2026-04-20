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
    
    // The image_path already includes "assets/", so we just need "../" prefix
    const imagePath = "../" + product.image_path;
    
    contentDiv.innerHTML = `
        <div class="product-detail">
            <h1>${product.title}</h1>
            <div class="product-image-container">
                <img src="${imagePath}" alt="${product.title}" class="product-large-image">
            </div>
        </div>
    `;
}

// Initialize product page
if (window.location.pathname.includes('producto_feria.html')) {
    document.addEventListener('DOMContentLoaded', loadProductData);
}
