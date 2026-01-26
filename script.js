// Data Storage
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        name: 'Smartphone',
        price: 2500000,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        description: 'Yangi avlod smartfon, kuchli protsessor va ajoyib kamera bilan'
    },
    {
        id: 2,
        name: 'Laptop',
        price: 8500000,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        description: 'Ish va o\'yin uchun ideal laptop, yuqori unumdorlik'
    },
    {
        id: 3,
        name: 'Naushniklar',
        price: 450000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        description: 'Wireless naushniklar, ajoyib ovoz sifati'
    },
    {
        id: 4,
        name: 'Smart Watch',
        price: 1200000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        description: 'Sog\'liqni kuzatish va smart funksiyalar bilan soat'
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];

// Theme Management
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const theme = document.documentElement.getAttribute('data-theme');
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Product Management
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const isLiked = likedProducts.includes(product.id);
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400?text=No+Image'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)} so'm</div>
                <div class="product-actions">
                    <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${product.id})">
                        ${isLiked ? '❤️' : '🤍'}
                    </button>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Savatga Qo'shish
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('uz-UZ').format(price);
}

// Like Functionality
function toggleLike(productId) {
    const index = likedProducts.indexOf(productId);
    if (index > -1) {
        likedProducts.splice(index, 1);
    } else {
        likedProducts.push(productId);
    }
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
    renderProducts();
}

// Cart Functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        showNotification(`${product.name} savatga qo'shildi!`);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    showNotification('Savat tozalandi!');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Savat bo\'sh</div>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80?text=No+Image'">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)} so'm x ${item.quantity}</p>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">O'chirish</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = formatPrice(total);
}

// Add Product Functionality
const addProductModal = document.getElementById('addProductModal');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');

addProductBtn.addEventListener('click', () => {
    addProductModal.classList.add('show');
});

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProduct = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value
    };
    
    products.push(newProduct);
    saveProducts();
    renderProducts();
    
    addProductForm.reset();
    closeModal(addProductModal);
    showNotification('Mahsulot muvaffaqiyatli qo\'shildi!');
});

// Cart Modal
const cartModal = document.getElementById('cartModal');
const cartBtn = document.getElementById('cartBtn');

cartBtn.addEventListener('click', () => {
    renderCart();
    cartModal.classList.add('show');
});

// Close Modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        closeModal(modal);
    });
});

function closeModal(modal) {
    modal.classList.remove('show');
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Clear Cart Button
document.getElementById('clearCart').addEventListener('click', clearCart);

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px var(--shadow);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize
updateCartCount();
renderProducts();

