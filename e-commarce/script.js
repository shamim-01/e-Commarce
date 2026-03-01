const searchBtn = document.getElementById('search-btn');
const cartBtn = document.getElementById('cart-btn');
const userBtn = document.getElementById('user-btn');
const menuToggle = document.getElementById('menu-toggle');
const searchBox = document.querySelector('.search-box');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const navbar = document.querySelector('.navbar');
const backToTop = document.querySelector('.back-to-top');
const filterBtns = document.querySelectorAll('.filter-btn');
const productsGrid = document.querySelector('.products-grid');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalPrice = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');

// Product Data
const products = [
  {
    id: 1,
    name: 'Casual T-Shirt',
    category: 'men',
    price: 29.99,
    image: 'images/Casual-T-Shirt.jpg',
    rating: 4.5,
  },
  {
    id: 2,
    name: "Women's Dress",
    category: 'women',
    price: 59.99,
    image: 'images/saree.jpg',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Leather Jacket',
    category: 'men',
    price: 99.99,
    image: 'images/jacket.jpg',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Summer Skirt',
    category: 'women',
    price: 39.99,
    image: 'images/women.jpg',
    rating: 4.3,
  },
  {
    id: 5,
    name: 'Designer Watch',
    category: 'accessories',
    price: 149.99,
    image: 'images/watch.jpg',
    rating: 4.9,
  },
  {
    id: 6,
    name: 'Leather Bag',
    category: 'accessories',
    price: 79.99,
    image: 'images/lather-bag.jpg',
    rating: 4.6,
  },
  {
    id: 7,
    name: "Men's Jeans",
    category: 'men',
    price: 49.99,
    image: 'images/jeans.jpg',
    rating: 4.4,
  },
  {
    id: 8,
    name: "Men's T-Shirt",
    category: 'men',
    price: 34.99,
    image: 'images/ment.jpg',
    rating: 4.2,
  },
];

// Cart Data
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
  // Load products
  displayProducts(products);

  // Load cart from localStorage if exists
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
  }

  startDealTimer();
});

// Toggle Search Box
searchBtn.addEventListener('click', function (e) {
  e.preventDefault();
  searchBox.classList.toggle('active');
  cartSidebar.classList.remove('active');
  navbar.classList.remove('active');
});

// Toggle Cart Sidebar
cartBtn.addEventListener('click', function (e) {
  e.preventDefault();
  cartSidebar.classList.toggle('active');
  searchBox.classList.remove('active');
  navbar.classList.remove('active');
});

// Close Cart Sidebar
closeCart.addEventListener('click', function () {
  cartSidebar.classList.remove('active');
});

// Toggle Mobile Menu
menuToggle.addEventListener('click', function () {
  navbar.classList.toggle('active');
  searchBox.classList.remove('active');
  cartSidebar.classList.remove('active');
});

// User Button (Placeholder)
userBtn.addEventListener('click', function (e) {
  e.preventDefault();
  alert('User account functionality would go here!');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function () {
    navbar.classList.remove('active');
  });
});

// Back to Top Button
window.addEventListener('scroll', function () {
  if (window.pageYOffset > 300) {
    backToTop.classList.add('active');
  } else {
    backToTop.classList.remove('active');
  }
});

backToTop.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

// Filter Products
filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const filter = this.getAttribute('data-filter');

    // Filter products
    let filteredProducts;
    if (filter === 'all') {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter(
        product => product.category === filter,
      );
    }

    // Display filtered products
    displayProducts(filteredProducts);
  });
});

// Display Products
function displayProducts(productsArray) {
  productsGrid.innerHTML = '';

  productsArray.forEach((product, index) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.style.animationDelay = `${index * 0.1}s`;

    productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-content">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                    <span>(${product.rating})</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;

    productsGrid.appendChild(productCard);
  });

  // Re-attach event listeners to new buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', addToCart);
  });
}

// Generate Star Rating
function generateStarRating(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += '<i class="fas fa-star"></i>';
    } else if (i === fullStars && hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }

  return stars;
}

// Add to Cart
function addToCart(e) {
  const productId = parseInt(e.target.getAttribute('data-id'));
  const product = products.find(p => p.id === productId);

  // Check if product is already in cart
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  // Update cart UI
  updateCartUI();

  // Show feedback
  showNotification(`${product.name} added to cart!`);

  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
  // Update cart items
  cartItemsContainer.innerHTML = '';

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;

    cartItemsContainer.appendChild(cartItem);
  });

  // total price update
  totalPrice.textContent = `$${total.toFixed(2)}`;

  // Update cart count
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = itemCount;

  // Add event listeners to cart item buttons
  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', decreaseQuantity);
  });

  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', increaseQuantity);
  });

  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', updateQuantity);
  });

  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', removeItem);
  });
}

// Decrease Quantity
function decreaseQuantity(e) {
  const productId = parseInt(e.target.getAttribute('data-id'));
  const item = cart.find(item => item.id === productId);

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter(item => item.id !== productId);
  }

  updateCartUI();
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Increase Quantity
function increaseQuantity(e) {
  const productId = parseInt(e.target.getAttribute('data-id'));
  const item = cart.find(item => item.id === productId);

  item.quantity += 1;

  updateCartUI();
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Quantity
function updateQuantity(e) {
  const productId = parseInt(e.target.getAttribute('data-id'));
  const item = cart.find(item => item.id === productId);
  const newQuantity = parseInt(e.target.value);

  if (newQuantity < 1) {
    cart = cart.filter(item => item.id !== productId);
  } else {
    item.quantity = newQuantity;
  }

  updateCartUI();
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Remove Item
function removeItem(e) {
  const productId = parseInt(e.target.getAttribute('data-id'));
  cart = cart.filter(item => item.id !== productId);

  updateCartUI();
  localStorage.setItem('cart', JSON.stringify(cart));

  showNotification('Item removed from cart');
}

// Checkout Button
checkoutBtn.addEventListener('click', function () {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  alert(
    `Thank you for your order! Total: $${totalPrice.textContent.substring(1)}\n\nThis is a demo site. In a real application, you would be redirected to a checkout page.`,
  );

  // Clear cart
  cart = [];
  updateCartUI();
  localStorage.removeItem('cart');
});

// Deal Time
function startDealTimer() {
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');

  // Set the countdown time
  let timeLeft = 12 * 60 * 60;

  function updateTimer() {
    if (timeLeft <= 0) {
      // Timer ended
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
      return;
    }

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');

    timeLeft--;

    // Schedule the next update
    setTimeout(updateTimer, 1000);
  }

  // Start the timer
  updateTimer();
}

// Show Notification
function showNotification(message) {
  // Check if notification element already exists
  let notification = document.querySelector('.notification');

  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add('show');

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Add CSS for notifications
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1002;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;

document.head.appendChild(notificationStyle);
