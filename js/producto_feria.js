// Load product from feria.json based on ID
async function loadProduct() {
    const productDetail = document.getElementById('productDetail');
    
    if (!productDetail) {
        console.error('Element productDetail not found');
        return;
    }
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            productDetail.innerHTML = '<h1>Producto no encontrado</h1>';
            return;
        }
        
        const response = await fetch('../assets/feria.json');
        const products = await response.json();
        
        const product = products.find(p => p.id == productId);
        
        console.log('Product size:', product.size);
        console.log('Product price:', product.price);
        
        if (!product) {
            productDetail.innerHTML = '<h1>Producto no encontrado</h1>';
            return;
        }
        
        const html = `
            <div class="product-detail">
                <img src="../${product.image_path}" alt="${product.title}">
                <h1>${product.title}</h1>
                <div class="product-info" style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 10px;">
                    <span class="product-size" style="font-size: 16px; color: #666; font-weight: 500;">${product.size ? 'talle ' + product.size : ''}</span>
                    <p class="product-price" style="font-size: 18px; color: #333; font-weight: 600; margin: 0;">$${product.price.toLocaleString()}</p>
                </div>
            </div>
        `;
        
        console.log('Setting HTML:', html);
        productDetail.innerHTML = html;
    } catch (error) {
        console.error('Error loading product:', error);
        productDetail.innerHTML = '<h1>Error al cargar el producto</h1>';
    }
}

// Load product when page loads
document.addEventListener('DOMContentLoaded', loadProduct);
