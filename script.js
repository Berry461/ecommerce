const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar){
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close){
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

/*const cartIcon = document.querySelector('#lg-bag');
const cart = document.querySelector('.cartc');
const cartClose = document.querySelector('#cart-close');
cartIcon.addEventListener('click', () => cart.classList.add('active'));
cartClose.addEventListener('click', () => cart.classList.remove('active'));

const addCartButtons = document.querySelectorAll('#cart-close');*/

document.addEventListener('DOMContentLoaded', () => {
    // Select the cart icons (desktop and mobile)
    const cartIconDesktop = document.querySelector('#lg-bag');
    const cartIconMobile = document.querySelector('#lg-bag-mobile');
    
    // Select the cart container
    const cart = document.querySelector('.cartc');
    
    // Select the close button
    const cartClose = document.querySelector('#cart-close');

    // Function to show the cart
    const showCart = () => {
        cart.classList.add('active');
    };

    // Function to hide the cart
    const hideCart = () => {
        cart.classList.remove('active');
    };

    // Add event listeners for desktop cart icon
    if (cartIconDesktop) {
        cartIconDesktop.addEventListener('click', showCart);
    }

    // Add event listeners for mobile cart icon
    if (cartIconMobile) {
        cartIconMobile.addEventListener('click', showCart);
    }

    // Add event listener for close button
    if (cartClose) {
        cartClose.addEventListener('click', hideCart);
    }
});

const cartContent = document.querySelector('.cartc-content');
const totalPriceElement = document.querySelector('.total-price');

// Load cart items from localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Function to save cart items to localStorage
const saveCartToLocalStorage = () => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

// Function to add item to cart
const addToCart = productBox => {
    const productImgSrc = productBox.querySelector('.product-img').src;
    const productTitle = productBox.querySelector('.product-title').textContent;
    const productPrice = productBox.querySelector('.price').textContent;

    // Check if the item already exists in the cart
    const existingItem = cartItems.find(item => item.title === productTitle);
    if (existingItem) {
        // If item exists, increase its quantity
        existingItem.quantity += 1;
        updateCartItem(existingItem);
    } else {
        // If item doesn't exist, add it to the cart
        const newItem = {
            imgSrc: productImgSrc,
            title: productTitle,
            price: parseFloat(productPrice.replace('$', '')),
            quantity: 1,
        };
        cartItems.push(newItem);
        renderCartItem(newItem);
    }

    // Save cart to localStorage and update the total price
    saveCartToLocalStorage();
    updateTotalPrice();
};

// Function to render a new cart item
const renderCartItem = item => {
    const cartBox = document.createElement('div');
    cartBox.classList.add('cart-box');
    cartBox.setAttribute('data-title', item.title);
    cartBox.innerHTML = `
        <img src="${item.imgSrc}" class="cartc-img">
        <div class="cartc-detail">
            <h2 class="cartc-product-title">${item.title}</h2>
            <span class="cartc-price">$${item.price.toFixed(2)}</span>
            <div class="cartc-quantity">
                <button class="decrement">-</button>
                <span class="number">${item.quantity}</span>
                <button class="increment">+</button>
            </div>
        </div>
        <i class="fa fa-trash cart-remove"></i>
    `;

    // Add event listeners for quantity buttons
    const incrementButton = cartBox.querySelector('.increment');
    const decrementButton = cartBox.querySelector('.decrement');
    const removeButton = cartBox.querySelector('.cart-remove');

    incrementButton.addEventListener('click', () => updateQuantity(item.title, 1));
    decrementButton.addEventListener('click', () => updateQuantity(item.title, -1));
    removeButton.addEventListener('click', () => removeItem(item.title));

    // Append the new cart item to the cart content
    cartContent.appendChild(cartBox);
};

// Function to update quantity
const updateQuantity = (title, change) => {
    const item = cartItems.find(item => item.title === title);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            // Remove item if quantity is less than 1
            removeItem(title);
        } else {
            // Update the quantity in the cart
            updateCartItem(item);
        }
        saveCartToLocalStorage();
        updateTotalPrice();
    }
};

// Function to update an existing cart item
const updateCartItem = item => {
    const cartBox = document.querySelector(`.cart-box[data-title="${item.title}"]`);
    if (cartBox) {
        const quantityElement = cartBox.querySelector('.number');
        quantityElement.textContent = item.quantity;
    }
};

// Function to remove an item from the cart
const removeItem = title => {
    cartItems = cartItems.filter(item => item.title !== title);
    const cartBox = document.querySelector(`.cart-box[data-title="${title}"]`);
    if (cartBox) {
        cartBox.remove();
    }
    saveCartToLocalStorage();
    updateTotalPrice();
};

// Function to update the total price
const updateTotalPrice = () => {
    let total = 0;
    cartItems.forEach(item => {
        total += item.price * item.quantity;
    });
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
};

// Function to load cart items from localStorage and render them
const loadCart = () => {
    cartItems.forEach(item => {
        renderCartItem(item);
    });
    updateTotalPrice();
};

// Load cart items when the page loads
document.addEventListener('DOMContentLoaded', loadCart);

// Add event listeners to "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.pro .cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productBox = button.closest('.pro');
        if (productBox) {
            addToCart(productBox);
        } else {
            console.error('Product box not found');
        }
    });
});