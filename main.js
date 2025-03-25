let allProducts = []; 
let checkedCategories = []; 
let currentSortCriteria = 'default';
let uniqueBrands = [];
let selectedRatingFilter = 0;
let selectedAvailabilityFilter = 'all'; 

// Function to fetch product data from the Dummy JSON API
async function fetchProducts() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'flex'; 

    try {
        const response = await fetch('https://dummyjson.com/products?limit=1000');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allProducts = data.products; 
        console.log(allProducts)
        uniqueBrands = [...new Set(allProducts.map(product => product.brand))]; 
        populateBrandDropdown(uniqueBrands); 
        allProducts.forEach(product => {
            product.stock = Math.random() > 0.5 ? 'inStock' : 'outOfStock'; 
        });
        renderProducts(allProducts); 
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        spinner.style.display = 'none'; 
    }
}

// Function to show suggestions based on the search input
function showSuggestions(value) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = ''; 

    if (value.length === 0) {
        return; 
    }

    const filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(value.toLowerCase())
    );

    filteredProducts.forEach(product => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.innerHTML = highlightText(product.title, value); 
        suggestionItem.onclick = () => selectSuggestion(product.title);
        suggestionsContainer.appendChild(suggestionItem);
    });
}

// Function to handle selection of a suggestion
function selectSuggestion(productTitle) {
    document.getElementById('search-input').value = productTitle;
    document.getElementById('suggestions').innerHTML = ''; 
}

// Function to highlight matching text in the suggestion
function highlightText(text, searchTerm) {
    if (!searchTerm) return text; 
    const regex = new RegExp(`(${searchTerm})`, 'gi'); 
    return text.replace(regex, '<span class="highlight">$1</span>'); 
}

// Function to show only matching products based on the input value
function showMatchingProducts() {
    const inputValue = document.getElementById('search-input').value.toLowerCase();
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; 

    const filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(inputValue)
    );

    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const cardHTML = `
                <div class="col-12 col-md-4 col-lg-3 mb-4">
                    <div class="card product-card card-style">
                        <img src="${product.images[0]}" class="card-img-top" alt="Product Image" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title text-truncate">${product.title}</h5>
                            <p class="card-text">$${product.price.toFixed(2)}</p>
                            <div class="rating mb-2">
                                ${getStars(product.rating)} 
                            </div>
                            <div class="description text-muted">
                                ${truncateDescription(product.description, 10)}
                            </div>
                        </div>
                        <div class="popup-info">
                            <img src="${product.images[0]}" class="card-img-top" alt="Product Image" style="height: 150px; object-fit: cover;">
                            <p class="card-title text-truncate">${product.title}</p>
                            <p class="card-text">$${product.price.toFixed(2)}</p>
                            <div class="description text-dark">
                                ${truncateDescription(product.description, 10)}
                            </div>
                            <div class="rating mb-2">
                                ${getStars(product.rating)} 
                            </div>
                            <div class="d-flex align-items-center mt-3">
                                <button class="btn add-btn me-2" onclick="addToCart('${product.id}')">Add to Cart</button>
                                <button class="btn btn-outline-secondary" onclick="showProductDetails('${product.id}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productContainer.innerHTML += cardHTML; 
        });
    } else {
        productContainer.innerHTML = '<p>No products found.</p>'; 
    }
}

// Function to get stars based on product rating
function getStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

// Function to truncate the product description
function truncateDescription(description, maxWords) {
    const words = description.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : description;
}

// Function to populate the brand dropdown
function populateBrandDropdown(brands) {
    const brandSelect = document.querySelector('.form-select');
    brandSelect.innerHTML = '<option selected>Choose a brand...</option>'; // Reset the dropdown

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand; 
        option.textContent = brand; 
        brandSelect.appendChild(option); 
    });
}

// Function to render products
function renderProducts(products) {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; 

    products.forEach(product => {
        const cardHTML = `
            <div class="col-12 col-md-4 col-lg-3 mb-4">
                <div class="card product-card card-style">
                    <img src="${product.images[0]}" class="card-img-top" alt="Product Image" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${product.title}</h5>
                        <p class="card-text">$${product.price.toFixed(2)}</p>
                        <div class="rating mb-2">
                            ${getStars(product.rating)} 
                        </div>
                        <div class="description text-muted">
                            ${truncateDescription(product.description, 10)}
                        </div>
                    </div>
                    <div class="popup-info">
                        <img src="${product.images[0]}" class="card-img-top" alt="Product Image" style="height: 150px; object-fit: cover;">
                        <p class="card-title text-truncate">${product.title}</p>
                        <p class="card-text">$${product.price.toFixed(2)}</p>
                        <div class="description text-dark">
                            ${truncateDescription(product.description, 10)}
                        </div>
                        <div class="rating mb-2">
                            ${getStars(product.rating)} 
                        </div>
                        <div class="d-flex align-items-center mt-3">
                            <button class="btn add-btn me-2" onclick="addToCart('${product.id}')">Add to Cart</button>
                            <button class="btn add-btn" onclick="showProductDetails('${product.id}')">
                                View
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += cardHTML;
    });
}

// Function to show product details
// ... [Previous JavaScript code remains exactly the same until the showProductDetails function]

// Updated Function to show product details with matching styling
function showProductDetails(productId) {
    const product = allProducts.find(item => String(item.id) === String(productId));
    if (product) {
        const modalBody = `
            <div class="product-details-container">
                <div class="row">
                    <div class="col-md-6">
                        <img src="${product.images[0]}" class="img-fluid rounded product-detail-image" alt="${product.title}">
                        <div class="d-flex mt-3 thumbnail-container">
                            ${product.images.slice(0, 4).map(img => `
                                <img src="${img}" class="img-thumbnail me-2 thumbnail-image" alt="Thumbnail" style="width: 60px; height: 60px; object-fit: cover;">
                            `).join('')}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h4 class="product-title mb-2">${product.title}</h4>
                        <p class="text-muted mb-2">Brand: ${product.brand}</p>
                        <p class="text-muted mb-2">Category: ${product.category}</p>
                        <div class="rating mb-3 d-flex align-items-center">
                            ${getStars(product.rating)} 
                            <span class="ms-2">${product.rating.toFixed(1)}/5</span>
                        </div>
                        <div class="price-container mb-3">
                            <h3 class="text-primary">$${product.price.toFixed(2)}</h3>
                            <p class="text-${product.stock === 'inStock' ? 'success' : 'danger'} mb-0">
                                ${product.stock === 'inStock' ? 'In Stock' : 'Out of Stock'}
                            </p>
                        </div>
                        <p class="product-description">${product.description}</p>
                        <div class="d-flex mt-4">
                            <button class="btn btn-primary me-2" onclick="addToCart('${product.id}')">Add to Cart</button>
                            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Continue Shopping</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.getElementById('productDetailsModal');
        if (modal) {
            modal.querySelector('.modal-body').innerHTML = modalBody;
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
            
            // Add click event for thumbnail images
            setTimeout(() => {
                document.querySelectorAll('.thumbnail-image').forEach(thumb => {
                    thumb.addEventListener('click', function() {
                        document.querySelector('.product-detail-image').src = this.src;
                    });
                });
            }, 100);
        } else {
            alert(`Product: ${product.title}\nPrice: $${product.price.toFixed(2)}\nRating: ${product.rating}\nDescription: ${product.description}`);
        }
    }
}

// ... [Rest of the JavaScript code remains exactly the same]

// Function to filter products based on selected categories
function filterProductsByCategories() {
    if (checkedCategories.length === 0) {
        return allProducts; 
    }
    return allProducts.filter(product => 
        checkedCategories.includes(product.category)
    );
}

// Function to filter products based on selected price
function filterProductsByPrice(products, maxPrice) {
    return products.filter(product => product.price <= maxPrice); 
}

// Function to filter products based on selected brand
function filterProductsByBrand(products, selectedBrand) {
    if (selectedBrand === "Choose a brand...") {
        return products; 
    }
    return products.filter(product => product.brand === selectedBrand); 
}

// Function to filter products based on selected rating
function filterProductsByRating(products) {
    return products.filter(product => Math.round(product.rating) >= selectedRatingFilter); 
}

// Function to filter products based on selected availability
function filterProductsByAvailability(products) {
    if (selectedAvailabilityFilter === 'all') {
        return products; 
    }
    return products.filter(product => product.stock === selectedAvailabilityFilter); 
}

// Function to apply all filters and sorting
async function applyFilters() {
    let products = filterProductsByCategories(); 
    const priceRange = document.getElementById('priceRange').value;
    products = filterProductsByPrice(products, priceRange); 
    const brandSelect = document.querySelector('.form-select');
    const selectedBrand = brandSelect.value;
    products = filterProductsByBrand(products, selectedBrand); 
    products = filterProductsByRating(products); 
    products = filterProductsByAvailability(products); 
    products = sortProducts(products, currentSortCriteria); 
    renderProducts(products); 
}

// Add event listener to the brand dropdown
document.querySelector('.form-select').addEventListener('change', function() {
    applyFilters(); 
});

// Add event listeners to rating filter
document.querySelectorAll('input[name="rating"]').forEach(item => {
    item.addEventListener('change', (event) => {
        selectedRatingFilter = parseInt(event.target.value);
        applyFilters(); 
    });
});

// Add event listeners for the availability radio buttons
document.querySelectorAll('input[name="availability"]').forEach(item => {
    item.addEventListener('change', (event) => {
        selectedAvailabilityFilter = event.target.value; 
        applyFilters(); 
    });
});

// Function to sort products
function sortProducts(products, criteria) {
    let sortedProducts;
    switch (criteria) {
        case 'low-to-high':
            sortedProducts = [...products].sort((a, b) => a.price - b.price);
            break;
        case 'high-to-low':
            sortedProducts = [...products].sort((a, b) => b.price - a.price);
            break;
        case 'popularity':
            sortedProducts = [...products].sort((a, b) => b.rating - a.rating); 
            break;
        case 'new-arrivals':
            sortedProducts = [...products].sort((a, b) => new Date(b.meta.createdAt) - new Date(a.meta.createdAt));
            break;
        default:
            sortedProducts = products; 
    }
    return sortedProducts; 
}

// Add event listeners to dropdown items for categories
document.querySelectorAll('.list-group-item input[data-category]').forEach(item => {
    item.addEventListener('change', (event) => {
        const category = item.getAttribute('data-category'); 

        if (item.checked) {
            if (!checkedCategories.includes(category)) {
                checkedCategories.push(category);
            }
        } else {
            checkedCategories = checkedCategories.filter(cat => cat !== category);
        }

        applyFilters();
    });
});

// Event listener for the price range input
const priceRangeInput = document.getElementById("priceRange");
const priceValueDisplay = document.getElementById("priceValue");

priceRangeInput.addEventListener("input", function () {
    const selectedPrice = parseInt(this.value); 
    priceValueDisplay.textContent = selectedPrice; 
    applyFilters();
});

// Add event listeners to dropdown items for sorting
document.querySelectorAll('.dropdown-item[data-sort]').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault();
        currentSortCriteria = event.target.getAttribute('data-sort'); 
        applyFilters(); 
    });
});

// Initialize cart from localStorage (if available)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add product to cart and show modal
function addToCart(productId) {
    const product = allProducts.find(item => String(item.id) === String(productId));

    if (product) {
        const existingProductIndex = cart.findIndex(item => String(item.id) === String(product.id));
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert("Product added to cart");
        showCartModal();
    } else {
        console.error("Product not found with id:", productId);
    }
}

// Function to update the cart item count in the navbar
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((total, product) => total + product.quantity, 0);
    cartCount.innerText = totalItems;
}

// Function to display cart contents inside the modal
function showCartModal() {
    const cartDetails = document.getElementById('cartDetails');
    cartDetails.innerHTML = '';
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach(product => {
            const productTotal = product.price * product.quantity;
            totalPrice += productTotal;

            const cartItemHTML = `
                <tr class="cart-item">
                    <td><img src="${product.images[0]}" class="cart-item-img" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                    <td><span class="cart-item-title">${product.title}</span></td>
                    <td><span class="cart-item-price">$${product.price.toFixed(2)}</span></td>
                    <td>
                        <input 
                            type="number" 
                            value="${product.quantity}" 
                            min="1" 
                            class="cart-item-quantity" 
                            style="width: 60px; padding: 5px;"
                            oninput="updateQuantity(${product.id}, this.value)">
                    </td>
                    <td><span class="cart-item-total">$${productTotal.toFixed(2)}</span></td>
                    <td><a href="#" class="delete" onClick="removeFromCart(${product.id})"><i class="fas fa-trash text-danger"></i></a></td>
                </tr>
            `;
            cartDetails.innerHTML += cartItemHTML;
        });

        const totalHTML = `
            <tr class="total-row">
                <td colspan="4" class="text-end"><strong>Total:</strong></td>
                <td colspan="2"><strong>$${totalPrice.toFixed(2)}</strong></td>
            </tr>
        `;
        cartDetails.innerHTML += totalHTML;
    } else {
        cartDetails.innerHTML = '<p>Your cart is empty.</p>';
    }

    const cartModal = new bootstrap.Modal(document.getElementById('addToCartModal'));
    if (!cartModal._isShown) {
        cartModal.show();
    }
}

// Function to remove a product from the cart
function removeFromCart(productId) {
    cart = cart.filter(item => String(item.id) !== String(productId));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCartModal();
}

// Function to update the quantity of a product in the cart
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;

    const product = cart.find(item => String(item.id) === String(productId));
    if (product) {
        product.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        showCartModal();
    }
}

// Function to clear the cart
function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    showCartModal();
}

// Event listener for the cart icon click
document.getElementById('cartIcon').addEventListener('click', function() {
    showCartModal();
});

// Initialize cart on page load
updateCartCount();

// Initial fetch of products
fetchProducts();

document.addEventListener("DOMContentLoaded", function() {
    var myModal = new bootstrap.Modal(document.getElementById('newsletterModal'));
    myModal.show();
});