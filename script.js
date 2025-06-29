// Product data with stock tracking
let products = [
    {
        id: 1,
        name: "Tropical Floral Maxi Dress",
        price: 59.99,
        originalPrice: 69.99,
        image: "https://petalandpup.com.au/cdn/shop/files/0L6A2485.jpg?v=1733742092&width=240",
        stock: 12,
        initialStock: 12
    },
    {
        id: 2,
        name: "Hibiscus Print Hawaiian Shirt",
        price: 44.99,
        originalPrice: 49.99,
        image: "https://www.lowes.com.au/media/catalog/product/4/2/42445_f_3.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=550&width=413&canvas=413:550",
        stock: 8,
        initialStock: 8
    },
    {
        id: 3,
        name: "Palm Tree Beach Cover-Up",
        price: 39.99,
        image: "https://shop-confete.com/cdn/shop/products/WillaBeachCoverUp_750x1000_crop_center_7ac921f8-6cfd-4199-acc4-84596865ebf4.jpg?v=1646671194&width=5000",
        stock: 15,
        initialStock: 15
    },
    {
        id: 4,
        name: "Raffia Sun Hat with Bow",
        price: 34.99,
        originalPrice: 39.99,
        image: "https://i.etsystatic.com/23159430/r/il/fde051/4813819435/il_794xN.4813819435_exv5.jpg",
        stock: 10,
        initialStock: 10
    },
    {
        id: 5,
        name: "Bamboo Fiber Tank Top",
        price: 29.99,
        image: "https://bamboahome.com/cdn/shop/files/white_bamboo_womens_tank_top_1.png?v=1741327353",
        stock: 20,
        initialStock: 20
    },
    {
        id: 6,
        name: "Tie-Dye Beach Sarong",
        price: 32.99,
        originalPrice: 37.99,
        image: "https://i.etsystatic.com/13139247/r/il/cd9bf9/1761765432/il_794xN.1761765432_gd2i.jpg",
        stock: 18,
        initialStock: 18
    },
    {
        id: 7,
        name: "Seashell Print Bikini Set",
        price: 49.99,
        originalPrice: 59.99,
        image: "https://media.cupshe.com/cdn-review.cupshe.com/cmc-admin/2024_07_18/19_30_2315/53abf8ea-3462-46e7-8268-368dc2fed299/CAA12C4G103UC/4.jpg?speedsize=mxw_1500",
        stock: 15,
        initialStock: 15
    },
    {
        id: 8,
        name: "Woven Straw Beach Bag",
        price: 39.99,
        image: "https://elenahandbags.com/cdn/shop/products/130cmx33cm_800x.jpg?v=1651806740",
        stock: 12,
        initialStock: 12
    },
    {
        id: 9,
        name: "Tropical Print Swim Shorts",
        price: 36.99,
        originalPrice: 42.99,
        image: "https://www.uptheir.co.uk/media/catalog/product/cache/92a89721a3bc3cca31ca1daa4fdb902d/t/u/tumbnail_06431cfb-fd67-4097-a144-6866e7d9a9b3.jpg",
        stock: 10,
        initialStock: 10
    },
    {
        id: 10,
        name: "Crochet Beach Cover-Up Dress",
        price: 45.99,
        image: "https://www.bsubseach.com/cdn/shop/files/sheer-bikini-coverup-fringe-tassel-tops-for-beach-white-564623.jpg?v=1717811982",
        stock: 8,
        initialStock: 8
    },
    {
        id: 11,
        name: "Men's Linen Beach Pants",
        price: 49.99,
        originalPrice: 55.99,
        image: "https://coofandy.com/cdn/shop/products/AP4A3026_ce070af4-d4df-42f1-97d3-a8f63b581b9a_1800x1800.jpg?v=1750742972",
        stock: 14,
        initialStock: 14
    },
    {
        id: 12,
        name: "Women's Strappy Sandals",
        price: 38.99,
        image: "https://d1q03ajwgi7cv2.cloudfront.net/media/catalog/product/cache/81d16df11efc363de1f31fe51afcad0e/d/u/duu-luci-0079506840086487_front.jpg",
        stock: 25,
        initialStock: 25
    }
];

let cart = []; // Array to store items in the cart

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartIcon = document.getElementById('cart-icon');
const cartCountElement = document.querySelector('.cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutContainer = document.getElementById('checkout-container');
const closeModalButtons = document.querySelectorAll('.close-modal');
const notificationContainer = document.getElementById('notification-container');

// Odoo API Configuration
let odooConfig = {
    url: '',
    db: '',
    username: '',
    password: ''
};

// Variable to store the Odoo User ID after successful login
let odooUid = null;

// Function to load config from Local Storage (if saved)
function loadOdooConfig() {
    const savedConfig = localStorage.getItem('odooConfig');
    if (savedConfig) {
        odooConfig = JSON.parse(savedConfig);
        // Update the admin panel fields if they exist
        if (document.getElementById('odoo-url')) {
            document.getElementById('odoo-url').value = odooConfig.url;
            document.getElementById('odoo-db').value = odooConfig.db;
            document.getElementById('odoo-username').value = odooConfig.username;
            document.getElementById('odoo-password').value = odooConfig.password;
        }
        updateApiStatus();
    }
}

// Function to save config to Local Storage
function saveOdooConfig(url, db, username, password) {
    odooConfig = { url, db, username, password };
    localStorage.setItem('odooConfig', JSON.stringify(odooConfig));
    updateApiStatus();
    // Show saved confirmation
    const configSavedElement = document.getElementById('config-saved');
    if (configSavedElement) {
        configSavedElement.style.display = 'block';
        setTimeout(() => {
            configSavedElement.style.display = 'none';
        }, 3000);
    }
}

// Update API Status display
function updateApiStatus() {
    const apiStatusElement = document.getElementById('api-status');
    if (apiStatusElement) {
        if (odooConfig.url && odooConfig.db && odooConfig.username && odooConfig.password) {
            apiStatusElement.textContent = 'API: Configured (not yet connected)';
            apiStatusElement.classList.remove('disconnected');
            apiStatusElement.classList.add('connected');
        } else {
            apiStatusElement.textContent = 'API: Not Configured';
            apiStatusElement.classList.remove('connected');
            apiStatusElement.classList.add('disconnected');
        }
    }
}

/**
 * Attempts to log in to the Odoo instance using the configured credentials.
 * Stores the Odoo User ID (UID) on success.
 * @returns {boolean} True if login is successful, false otherwise.
 */
async function odooLogin() {
    if (!odooConfig.url || !odooConfig.db || !odooConfig.username || !odooConfig.password) {
        console.error('Odoo API configuration is incomplete.');
        showCartNotification('Odoo API configuration is incomplete. Please check Admin Panel.');
        return false;
    }

    const loginUrl = `${odooConfig.url}/xmlrpc/2/common`;
    const params = [odooConfig.db, odooConfig.username, odooConfig.password, {}];

    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "call",
                params: {
                    service: "common",
                    method: "login",
                    args: params
                },
                id: Math.floor(Math.random() * 1000)
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
            console.error('Odoo login error:', data.error.message);
            showCartNotification(`Odoo Login Failed: ${data.error.message}`);
            return false;
        }

        odooUid = data.result;
        console.log('Odoo Login Successful. UID:', odooUid);
        showCartNotification('Successfully connected to Odoo!');

        const apiStatusElement = document.getElementById('api-status');
        if (apiStatusElement) {
            apiStatusElement.textContent = 'API: Connected';
            apiStatusElement.classList.remove('disconnected');
            apiStatusElement.classList.add('connected');
        }
        return true;
    } catch (error) {
        console.error('Error connecting to Odoo:', error);
        showCartNotification(`Error connecting to Odoo: ${error.message}`);
        const apiStatusElement = document.getElementById('api-status');
        if (apiStatusElement) {
            apiStatusElement.textContent = 'API: Connection Error';
            apiStatusElement.classList.remove('connected');
            apiStatusElement.classList.add('disconnected');
        }
        return false;
    }
}

/**
 * Generic function to call any Odoo model method using execute_kw.
 * Automatically attempts to log in if not already authenticated.
 * @param {string} model - The Odoo model name (e.g., 'product.product').
 * @param {string} method - The method to call on the model (e.g., 'search_read', 'create', 'write').
 * @param {Array} args - Positional arguments for the method.
 * @param {Object} kwargs - Keyword arguments (dictionary) for the method.
 * @returns {Promise<any|null>} The result of the Odoo call, or null if an error occurs.
 */
async function callOdooMethod(model, method, args = [], kwargs = {}) {
    // Attempt to log in if not already authenticated
    if (!odooUid) {
        console.warn('Not logged in to Odoo. Attempting to log in automatically...');
        const loggedIn = await odooLogin();
        if (!loggedIn) {
            showCartNotification('Failed to connect to Odoo for data retrieval. Please check configuration.');
            return null;
        }
    }

    const callUrl = `${odooConfig.url}/xmlrpc/2/object`;
    const params = {
        service: "object",
        method: "execute_kw",
        args: [odooConfig.db, odooUid, odooConfig.password, model, method, args, kwargs]
    };

    try {
        const response = await fetch(callUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "call",
                params: params,
                id: Math.floor(Math.random() * 1000)
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
            console.error(`Odoo API error for ${model}.${method}:`, data.error.message);
            showCartNotification(`Odoo Data Error: ${data.error.message}`);
            return null;
        }
        return data.result;
    } catch (error) {
        console.error(`Error calling Odoo API method ${model}.${method}:`, error);
        showCartNotification(`Error fetching data from Odoo: ${error.message}`);
        return null;
    }
}


// Display products with stock information
function displayProducts() {
    // CORRECTED: Removed redundant declaration, using the global productsContainer
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const isOutOfStock = product.stock <= 0;
        const stockClass = isOutOfStock ? 'out-of-stock' : (product.stock < 5 ? 'low-stock' : 'in-stock');
        const stockText = isOutOfStock ? 'Out of Stock' :
                         (product.stock < 5 ? `Only ${product.stock} left!` : `In Stock (${product.stock})`);

        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <p class="stock-info ${stockClass}">${stockText}</p>
                <button class="add-to-cart" data-id="${product.id}" ${isOutOfStock ? 'disabled' : ''}>
                    ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });

    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart with stock validation
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);

    if (!product || product.stock <= 0) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    // Update stock
    product.stock -= 1;
    updateCart();
    displayProducts(); // Refresh product display
    showCartNotification(`${product.name} added to cart!`);
}

// Update cart UI and totals
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `$${total.toFixed(2)}`;

    // Update cart items display
    renderCartItems();
}

// Render cart items with remove functionality
function renderCartItems() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5" style="text-align: center;">Your cart is empty</td></tr>';
        return;
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const cartItemRow = document.createElement('tr');
        cartItemRow.innerHTML = `
            <td>
                <div class="product-info">
                    <img src="${item.image}" class="product-img" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}" ${product.stock <= 0 ? 'disabled' : ''}>+</button>
                </div>
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button></td>
        `;
        cartItemsContainer.appendChild(cartItemRow);
    });

    // Add event listeners to quantity buttons
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });

    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

// Decrease quantity
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if (item.quantity > 1) {
        item.quantity -= 1;
        product.stock += 1; // Return one to stock
    } else {
        // Remove item completely
        product.stock += item.quantity; // Return all to stock
        cart = cart.filter(i => i.id !== productId);
    }

    updateCart();
    displayProducts(); // Refresh product display
}

// Increase quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if (product.stock > 0) {
        item.quantity += 1;
        product.stock -= 1;
        updateCart();
        displayProducts(); // Refresh product display
    }
}

// Remove item completely
function removeItem(e) {
    const productId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if (item && product) {
        product.stock += item.quantity; // Return all to stock
        cart = cart.filter(i => i.id !== productId);
        updateCart();
        displayProducts(); // Refresh product display
        showCartNotification(`${item.name} removed from cart!`);
    }
}

// Show checkout window
function showCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    checkoutContainer.innerHTML = `
        <div class="checkout-summary">
            <h3>Order Summary</h3>
            <div class="checkout-items">
                ${cart.map(item => `
                    <div class="checkout-item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="checkout-total">
                <span>Total:</span>
                <span>$${calculateCartTotal().toFixed(2)}</span>
            </div>

            <form id="checkout-form">
                <h4>Customer Information</h4>
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="address">Shipping Address</label>
                    <textarea id="address" required></textarea>
                </div>

                <h4>Payment Method</h4>
                <div class="payment-methods">
                    <label>
                        <input type="radio" name="payment" value="credit-card" checked> Credit Card
                    </label>
                    <label>
                        <input type="radio" name="payment" value="paypal"> PayPal
                    </label>
                </div>

                <div id="credit-card-fields">
                    <div class="form-group">
                        <label for="card-type">Card Type</label>
                        <select id="card-type" required>
                            <option value="">Select Card Type</option>
                            <option value="visa">Visa</option>
                            <option value="mastercard">Mastercard</option>
                            <option value="amex">American Express</option>
                            <option value="discover">Discover</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="card-number">Card Number</label>
                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="card-expiry">Expiry Date (MM/YY)</label>
                            <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" required>
                        </div>
                        <div class="form-group">
                            <label for="card-cvc">CVC</label>
                            <input type="text" id="card-cvc" placeholder="123" maxlength="4" required>
                        </div>
                    </div>
                </div>

                <div id="paypal-fields" style="display: none;">
                    <p>You will be redirected to PayPal to complete your payment</p>
                    <div class="paypal-logo">
                        <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal">
                    </div>
                </div>

                <button type="submit" class="btn">Place Order</button>
            </form>
        </div>
    `;

    // Auto-format card number with spaces
    const cardNumberInput = document.getElementById('card-number');
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '');
        if (value.length > 0) {
            value = value.match(/.{1,4}/g).join(' ');
        }
        e.target.value = value.substring(0, 19);

        // Detect card type
        const cardTypeSelect = document.getElementById('card-type');
        const firstDigits = value.replace(/\s+/g, '').substring(0, 2);

        if (/^4/.test(firstDigits)) {
            cardTypeSelect.value = 'visa';
        } else if (/^5[1-5]/.test(firstDigits)) {
            cardTypeSelect.value = 'mastercard';
        } else if (/^3[47]/.test(firstDigits)) {
            cardTypeSelect.value = 'amex';
        } else if (/^6(?:011|5)/.test(firstDigits)) {
            cardTypeSelect.value = 'discover';
        }
    });

    // Auto-format expiry date with slash
    const expiryInput = document.getElementById('card-expiry');
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value.substring(0, 5);
    });

    // Handle payment method toggle
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('credit-card-fields').style.display =
                this.value === 'credit-card' ? 'block' : 'none';
            document.getElementById('paypal-fields').style.display =
                this.value === 'paypal' ? 'block' : 'none';
        });
    });

    // Handle form submission
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        placeOrder();
    });

    cartModal.style.display = 'none';
    checkoutModal.style.display = 'flex';
}

// Place order function
function placeOrder() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    let paymentDetails = {};

    if (paymentMethod === 'credit-card') {
        const cardType = document.getElementById('card-type').value;
        const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvc = document.getElementById('card-cvc').value;

        if (!cardType) {
            alert('Please select a card type');
            return;
        }

        // Validate card number (16 digits, 15 for Amex)
        const cardLengthValid = (cardType === 'amex' && cardNumber.length === 15) ||
                              (cardType !== 'amex' && cardNumber.length === 16);

        if (!cardLengthValid || !/^\d+$/.test(cardNumber)) {
            alert('Please enter a valid card number');
            return;
        }

        // Validate expiry date (MM/YY format)
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            alert('Please enter expiry date in MM/YY format');
            return;
        }

        // Validate CVC (3-4 digits)
        const cvcLength = cardType === 'amex' ? 4 : 3;
        if (!new RegExp(`^\\d{${cvcLength}}$`).test(cardCvc)) {
            alert(`Please enter a valid ${cvcLength}-digit CVC`);
            return;
        }

        paymentDetails = {
            method: 'credit-card',
            cardType,
            cardLast4: cardNumber.slice(-4),
            cardExpiry
        };
    } else {
        paymentDetails = {
            method: 'paypal'
        };
    }

    // In a real app, you would send this data to your server
    const order = {
        customer: { name, email, address },
        payment: paymentDetails,
        items: cart,
        total: calculateCartTotal(),
        date: new Date().toISOString()
    };

    console.log('Order placed:', order);

    // Show confirmation
    checkoutModal.style.display = 'none'; // Close checkout modal
    document.getElementById('order-confirmation-modal').style.display = 'flex'; // Show confirmation modal

    // Update order details in confirmation modal
    document.getElementById('order-details').innerHTML = `
        <i class="fas fa-check-circle success-icon"></i>
        <h3>Order Confirmed!</h3>
        <p>Thank you for your purchase, ${name}.</p>
        <p>A confirmation has been sent to ${email}.</p>
        <button class="btn" id="return-to-shop-btn">Return to Shop</button>
    `;

    document.getElementById('return-to-shop-btn').addEventListener('click', () => {
        // Reset cart
        cart = [];
        updateCart();
        document.getElementById('order-confirmation-modal').style.display = 'none';

        // Reset product stock (for demo purposes)
        products.forEach(p => p.stock = p.initialStock);
        displayProducts();
    });
}

// Calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Show cart notification
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Initialize the app
function init() {
    displayProducts();

    // Cart icon click
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });

    // Close modals
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Checkout button (now has ID in HTML)
    document.getElementById('checkout-btn').addEventListener('click', showCheckout);

    // Shop Now button
    document.getElementById('shop-now').addEventListener('click', (e) => {
        e.preventDefault();
        // Scroll to products
        document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
    });

    // View Lookbook button
    document.getElementById('view-lookbook').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
    });

    // Handle checkout form submission (event listener moved to showCheckout for dynamic form)
    // The event listener is now attached inside the showCheckout function, after the form is created.

    // Admin Panel Toggle
    document.getElementById('admin-toggle').addEventListener('click', () => {
        // CORRECTED: Referencing 'admin-panel-modal' to match HTML
        const adminModal = document.getElementById('admin-panel-modal');
        adminModal.style.display = adminModal.style.display === 'block' ? 'none' : 'block';
    });

    // Admin Panel Form Submission
    document.getElementById('api-config-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const url = document.getElementById('odoo-url').value;
        const db = document.getElementById('odoo-db').value;
        const username = document.getElementById('odoo-username').value;
        const password = document.getElementById('odoo-password').value;

        saveOdooConfig(url, db, username, password); // Save config to local storage
        await odooLogin(); // Attempt to log in immediately after saving config
    });

    // Load Odoo config on startup
    loadOdooConfig();
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);