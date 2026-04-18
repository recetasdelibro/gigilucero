// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(
    'YOUR_SUPABASE_URL', // Replace with your Supabase URL
    'YOUR_SUPABASE_ANON_KEY' // Replace with your Supabase anon key
);

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

// Fuzzy search functionality
async function searchRecipes(searchTerm) {
    try {
        const { data, error } = await supabaseClient
            .rpc('buscar_recetas_fuzzy', { 
                search_term: searchTerm 
            });
        
        if (error) {
            console.error('Error searching recipes:', error);
            return [];
        }
        
        if (data) {
            console.log(data);
            return data;
        }
        
        return [];
    } catch (error) {
        console.error('Error in searchRecipes:', error);
        return [];
    }
}

// Display search results
function displaySearchResults(results) {
    const searchResultsDiv = document.getElementById('searchResults');
    
    if (!results || results.length === 0) {
        searchResultsDiv.innerHTML = '<p class="no-results">No se encontraron recetas.</p>';
        return;
    }
    
    const resultsHTML = results.map(recipe => `
        <div class="recipe-card">
            <h3 class="recipe-title">${recipe.nombre || recipe.title || 'Sin título'}</h3>
            <p class="recipe-description">${recipe.descripcion || recipe.description || 'Sin descripción'}</p>
            ${recipe.ingredientes ? `<p class="recipe-ingredients"><strong>Ingredientes:</strong> ${recipe.ingredientes}</p>` : ''}
        </div>
    `).join('');
    
    searchResultsDiv.innerHTML = resultsHTML;
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', async function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                const results = await searchRecipes(searchTerm);
                displaySearchResults(results);
            }
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', async function(event) {
            if (event.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    const results = await searchRecipes(searchTerm);
                    displaySearchResults(results);
                }
            }
        });
    }
});
