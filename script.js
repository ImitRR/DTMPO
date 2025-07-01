// Product data with stock tracking - This array serves as the default fallback.
// It will be replaced by Odoo data if a successful connection and product fetch occurs.
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

// Configuration for Glitch Proxy
const config = {
  proxyUrl: 'https://lead-awake-rhythm.glitch.me', // <--- Your Glitch Proxy URL (NO trailing slash)
  apiKey: 's0m3R4nd0mStR1ngF0rMyPr0xyS3cur1ty_xyz123' // <--- Your API Key (must match Glitch .env)
};

// Odoo API Configuration (will be populated from Admin Panel)
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
            // Corrected: Add autocomplete attribute to username and password fields
            const usernameInput = document.getElementById('odoo-username');
            if (usernameInput) {
                usernameInput.value = odooConfig.username;
                usernameInput.setAttribute('autocomplete', 'username');
            }
            const passwordInput = document.getElementById('odoo-password');
            if (passwordInput) {
                passwordInput.value = odooConfig.password;
                passwordInput.setAttribute('autocomplete', 'current-password');
            }
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
 * Makes a request to the Glitch proxy to interact with Odoo.
 * This function abstracts the communication with your Glitch proxy,
 * which in turn handles the JSON-RPC 2.0 calls to Odoo's /web/session/authenticate or /web/dataset/call_kw.
 * @param {string} proxyEndpointType The type of Odoo call for the proxy ('login' or 'odoo_call').
 * @param {Object} payload The specific payload to send to the proxy.
 * @returns {Promise<any>} The response data from Odoo via the proxy, or null on error.
 */
async function odooProxyFetch(proxyEndpointType, payload) {
    const apiStatusElement = document.getElementById('api-status');

    // --- DEBUGGING LOGS ---
    console.log('--- odooProxyFetch DEBUG ---');
    console.log('config.proxyUrl:', config.proxyUrl);
    console.log('config.apiKey:', config.apiKey);
    console.log('Proxy Endpoint Type:', proxyEndpointType); // Changed from 'Service'
    // --- END DEBUGGING LOGS ---

    if (!config.proxyUrl) {
        console.error('Glitch Proxy URL is not configured. Please set config.proxyUrl in script.js.');
        apiStatusElement.textContent = 'API: Proxy URL not set';
        apiStatusElement.classList.remove('connected');
        apiStatusElement.classList.add('disconnected');
        return null;
    }
    if (!config.apiKey) {
        console.error('Glitch API Key is not configured. Please set config.apiKey in script.js.');
        apiStatusElement.textContent = 'API: API Key not set';
        apiStatusElement.classList.remove('connected');
        apiStatusElement.classList.add('disconnected');
        return null;
    }

    let endpoint = '';
    if (proxyEndpointType === 'login') {
        endpoint = '/api/login';
    } else if (proxyEndpointType === 'odoo_call') {
        endpoint = '/api/odoo'; // This is the endpoint for general Odoo API calls
    } else {
        console.error(`Unsupported Odoo proxy call type: ${proxyEndpointType}`);
        apiStatusElement.textContent = `API: Unsupported Odoo call type`;
        apiStatusElement.classList.remove('connected');
        apiStatusElement.classList.add('disconnected');
        return null;
    }

    // --- DEBUGGING LOG ---
    const fullUrl = `${config.proxyUrl}${endpoint}`;
    console.log('Constructed Full URL:', fullUrl);
    // --- END DEBUGGING LOG ---

    try {
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': config.apiKey
            },
            body: JSON.stringify(payload) // Send the entire payload directly
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        if (data.error) {
            // Odoo returns 200 OK even for errors, but the error object is in data.error
            throw new Error(`Odoo Error via Proxy: ${data.error.message || JSON.stringify(data.error)}`);
        }
        return data.result; // Assuming the proxy returns Odoo's 'result' directly
    } catch (error) {
        console.error('Error during Odoo fetch via proxy:', error);
        apiStatusElement.textContent = `API: Disconnected (${error.message})`;
        apiStatusElement.classList.remove('connected');
        apiStatusElement.classList.add('disconnected');
        return null; // Return null on error
    }
}


/**
 * Attempts to log in to the Odoo instance using the configured credentials via Glitch proxy.
 * Stores the Odoo User ID (UID) on success.
 * @returns {boolean} True if login is successful, false otherwise.
 */
async function odooLogin() {
    const apiStatusElement = document.getElementById('api-status');
    if (!odooConfig.url || !odooConfig.db || !odooConfig.username || !odooConfig.password) {
        apiStatusElement.textContent = 'API: Not Configured';
        apiStatusElement.classList.remove('connected');
        apiStatusElement.classList.add('disconnected');
        return false;
    }

    try {
        const loginPayload = {
            odooConfig: odooConfig // Send the full odooConfig
        };
        // Call odooProxyFetch with 'login' type
        const result = await odooProxyFetch('login', loginPayload);

        if (result) { // result directly contains uid on successful authentication
            odooUid = result; // Store the user ID as UID
            apiStatusElement.textContent = 'API: Connected';
            apiStatusElement.classList.remove('disconnected');
            apiStatusElement.classList.add('connected');
            console.log('Odoo login successful. UID:', odooUid);
            // After successful login, try to fetch products
            await fetchOdooProducts(); // Call the new function to fetch products
            return true;
        } else {
            throw new Error('Authentication failed: No user ID returned from proxy.');
        }
    } catch (error) {
        console.error('Odoo login failed:', error);
        odooUid = null;
        apiStatusElement.textContent = `API: Disconnected (${error.message})`;
        apiStatusElement.classList.remove('connected');
        apiStatusElement.classList.add('disconnected');
        return false;
    }
}

/**
 * Generic function to call any Odoo model method using call_kw via Glitch proxy.
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
        console.warn('Not logged in to Odoo. Attempting to log in automatically before calling Odoo method...');
        const loggedIn = await odooLogin();
        if (!loggedIn) {
            showCartNotification('Failed to connect to Odoo for data retrieval. Please check configuration.');
            return null;
        }
    }

    // CORRECTED PAYLOAD STRUCTURE for /web/dataset/call_kw as expected by Glitch proxy
    const callKwPayload = {
        odooConfig: odooConfig, // Pass odooConfig for proxy context (contains db, etc.)
        uid: odooUid,
        model: model,   // Direct 'model' parameter for Odoo's call_kw
        method: method, // Direct 'method' parameter for Odoo's call_kw
        args: args,     // Positional arguments for the Odoo method
        kwargs: kwargs  // Keyword arguments for the Odoo method
    };

    // Call odooProxyFetch with 'odoo_call' type and the new payload
    const result = await odooProxyFetch('odoo_call', callKwPayload);

    if (result === null) {
        console.error(`Odoo API error for ${model}.${method} via proxy.`);
        return null;
    }
    return result;
}

/**
 * Fetches product data from Odoo via the Glitch proxy.
 * Updates the 'products' array only if the fetch is successful.
 */
async function fetchOdooProducts() {
    if (!odooUid) {
        console.warn('Not logged in to Odoo. Cannot fetch products.');
        return;
    }

    try {
        const productData = await callOdooMethod('product.template', 'search_read', [], {
            fields: ['name', 'list_price', 'standard_price', 'image_1920', 'qty_available'],
            limit: 20 // Limit to 20 products for example
        });

        if (productData) {
            // Map Odoo product data to your local 'products' array format
            // Only update 'products' if data is successfully fetched
            products = productData.map(odooProduct => ({
                id: odooProduct.id,
                name: odooProduct.name,
                price: odooProduct.list_price || 0, // Sale price
                originalPrice: odooProduct.standard_price || odooProduct.list_price || 0, // Cost price or sale price
                // Odoo returns base64 image data, prepend data URI for direct use
                image: odooProduct.image_1920 ? `data:image/png;base64,${odooProduct.image_1920}` : 'https://placehold.co/250x250/cccccc/000000?text=No+Image',
                stock: odooProduct.qty_available || 0,
                initialStock: odooProduct.qty_available || 0 // Assuming initial stock is current stock
            }));
            displayProducts(); // Re-render products with fetched Odoo data
            console.log('Products fetched from Odoo:', products);
        }
    } catch (error) {
        console.error('Failed to fetch products from Odoo:', error);
        // If fetching fails, the 'products' array retains its previous state (hardcoded data).
        // No need to re-render here, as the initial render already happened with fallback data.
    }
}


// Display products with stock information
function displayProducts() {
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
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/250x250/cccccc/000000?text=Image+Not+Found';">
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

    if (!product || product.stock <= 0) {
        showCartNotification(`Sorry, ${product.name} is out of stock.`);
        return;
    }

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
        const product = products.find(p => p.id === item.id); // Ensure product is found in the current 'products' array
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
                    <button class="quantity-btn increase" data-id="${item.id}" ${product && product.stock <= 0 ? 'disabled' : ''}>+</button>
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

    if (item && product) {
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
}

// Increase quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if (item && product && product.stock > 0) {
        item.quantity += 1;
        product.stock -= 1;
        updateCart();
        displayProducts(); // Refresh product display
    } else if (product && product.stock <= 0) {
        showCartNotification(`Cannot add more of ${product.name}, out of stock.`);
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
        showCartNotification('Your cart is empty!'); // Changed from alert to notification
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
    if (cardNumberInput) { // Check if element exists
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '');
            if (value.length > 0) {
                value = value.match(/.{1,4}/g).join(' ');
            }
            e.target.value = value.substring(0, 19);

            // Detect card type
            const cardTypeSelect = document.getElementById('card-type');
            if (cardTypeSelect) { // Check if element exists
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
            }
        });
    }


    // Auto-format expiry date with slash
    const expiryInput = document.getElementById('card-expiry');
    if (expiryInput) { // Check if element exists
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
        });
    }


    // Handle payment method toggle
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const creditCardFields = document.getElementById('credit-card-fields');
            const paypalFields = document.getElementById('paypal-fields');
            if (creditCardFields) creditCardFields.style.display =
                this.value === 'credit-card' ? 'block' : 'none';
            if (paypalFields) paypalFields.style.display =
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
async function placeOrder() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    let paymentDetails = {};

    if (paymentMethod === 'credit-card') {
        const cardType = document.getElementById('card-type') ? document.getElementById('card-type').value : '';
        const cardNumber = document.getElementById('card-number') ? document.getElementById('card-number').value.replace(/\s+/g, '') : '';
        const cardExpiry = document.getElementById('card-expiry') ? document.getElementById('card-expiry').value : '';
        const cardCvc = document.getElementById('card-cvc') ? document.getElementById('card-cvc').value : '';

        if (!cardType) {
            showCartNotification('Please select a card type');
            return;
        }

        const cardLengthValid = (cardType === 'amex' && cardNumber.length === 15) ||
                              (cardType !== 'amex' && cardNumber.length === 16);

        if (!cardLengthValid || !/^\d+$/.test(cardNumber)) {
            showCartNotification('Please enter a valid card number');
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            showCartNotification('Please enter expiry date in MM/YY format');
            return;
        }

        const cvcLength = cardType === 'amex' ? 4 : 3;
        if (!new RegExp(`^\\d{${cvcLength}}$`).test(cardCvc)) {
            showCartNotification(`Please enter a valid ${cvcLength}-digit CVC`);
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

    showCartNotification('Processing your order...');

    try {
        // 1. Find or Create Customer (res.partner)
        let customerId;
        const existingPartners = await callOdooMethod('res.partner', 'search_read', [[['email', '=', email]]], { fields: ['id'] });
        
        if (existingPartners && existingPartners.length > 0) {
            customerId = existingPartners[0].id;
            console.log('Found existing customer in Odoo:', customerId);
        } else {
            const newPartner = await callOdooMethod('res.partner', 'create', [{
                name: name,
                email: email,
                street: address,
                customer_rank: 1 // Mark as a customer
            }]);
            if (newPartner) {
                customerId = newPartner; // Odoo create returns the ID of the new record
                console.log('Created new customer in Odoo:', customerId);
            } else {
                throw new Error('Failed to create customer in Odoo.');
            }
        }

        if (!customerId) {
            throw new Error('Customer ID could not be determined for Odoo order.');
        }

        // 2. Create Sales Order (sale.order)
        const orderLines = cart.map(item => [0, 0, {
            product_id: item.id, // Odoo product ID
            product_uom_qty: item.quantity,
            price_unit: item.price,
        }]);

        const saleOrderData = {
            partner_id: customerId,
            order_line: orderLines,
            // You can add more fields if needed, e.g., 'payment_term_id', 'client_order_ref'
        };

        const saleOrderId = await callOdooMethod('sale.order', 'create', [saleOrderData]);

        if (!saleOrderId) {
            throw new Error('Failed to create sales order in Odoo.');
        }
        console.log('Created Sales Order in Odoo:', saleOrderId);

        // 3. Confirm Sales Order to trigger stock movements (optional, depending on Odoo config)
        // This step is crucial for stock deduction in Odoo.
        const confirmResult = await callOdooMethod('sale.order', 'action_confirm', [[saleOrderId]]);

        if (!confirmResult) {
            console.warn('Failed to confirm sales order in Odoo. Stock might not be deducted automatically.');
            // Continue, but warn the user or log this for admin review
        } else {
            console.log('Sales Order confirmed in Odoo:', saleOrderId);
        }

        // Simulate order placement (local data)
        const order = {
            customer: { name, email, address },
            payment: paymentDetails,
            items: cart,
            total: calculateCartTotal(),
            date: new Date().toISOString(),
            odooSaleOrderId: saleOrderId // Store Odoo's order ID
        };

        console.log('Order placed successfully:', order);

        // Show confirmation
        checkoutModal.style.display = 'none';
        document.getElementById('order-confirmation-modal').style.display = 'flex';

        const orderDetailsElement = document.getElementById('order-details');
        if (orderDetailsElement) {
            orderDetailsElement.innerHTML = `
                <i class="fas fa-check-circle success-icon"></i>
                <h3>Order Confirmed!</h3>
                <p>Thank you for your purchase, ${name}.</p>
                <p>A confirmation has been sent to ${email}.</p>
                <p>Odoo Sales Order ID: <strong>${saleOrderId}</strong></p>
                <button class="btn" id="return-to-shop-btn">Return to Shop</button>
            `;
        }

        const returnToShopBtn = document.getElementById('return-to-shop-btn');
        if (returnToShopBtn) {
            returnToShopBtn.addEventListener('click', () => {
                // Reset cart
                cart = [];
                updateCart();
                document.getElementById('order-confirmation-modal').style.display = 'none';

                // Re-fetch products from Odoo to get updated stock levels
                fetchOdooProducts(); 
            });
        }

    } catch (error) {
        console.error('Error placing order with Odoo:', error);
        showCartNotification(`Failed to place order: ${error.message || 'An unexpected error occurred.'}`);
        // Keep checkout modal open or show an error message there
        checkoutModal.style.display = 'flex'; // Keep it open on error
    }
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
    // Always display products initially from the hardcoded array.
    // Odoo products will override this if successfully fetched.
    displayProducts();

    // Cart icon click
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });

    // Close modals
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Checkout button (now has ID in HTML)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) { // Check if element exists
        checkoutBtn.addEventListener('click', showCheckout);
    }


    // Shop Now button
    const shopNowBtn = document.getElementById('shop-now');
    if (shopNowBtn) { // Check if element exists
        shopNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Scroll to products
            const productsSection = document.querySelector('.products');
            if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }


    // View Lookbook button
    const viewLookbookBtn = document.getElementById('view-lookbook');
    if (viewLookbookBtn) { // Check if element exists
        viewLookbookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const heroSection = document.querySelector('.hero');
            if (heroSection) heroSection.scrollIntoView({ behavior: 'smooth' });
        });
    }


    // Admin Panel Toggle
    const adminToggle = document.getElementById('admin-toggle');
    if (adminToggle) { // Check if element exists
        adminToggle.addEventListener('click', () => {
            const adminModal = document.getElementById('admin-panel-modal');
            if (adminModal) { // Check if element exists
                adminModal.style.display = adminModal.style.display === 'block' ? 'none' : 'block';
            }
        });
    }


    // Admin Panel Form Submission
    const apiConfigForm = document.getElementById('api-config-form');
    if (apiConfigForm) { // Check if element exists
        apiConfigForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const urlInput = document.getElementById('odoo-url');
            const dbInput = document.getElementById('odoo-db');
            const usernameInput = document.getElementById('odoo-username');
            const passwordInput = document.getElementById('odoo-password');

            const url = urlInput ? urlInput.value : '';
            const db = dbInput ? dbInput.value : '';
            const username = usernameInput ? usernameInput.value : '';
            const password = passwordInput ? passwordInput.value : '';

            saveOdooConfig(url, db, username, password); // Save config to local storage
            await odooLogin(); // Attempt to log in immediately after saving config
        });
    }


    // Load Odoo config on startup
    loadOdooConfig();
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
