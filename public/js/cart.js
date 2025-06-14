/*class CartSystem {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.init();
    }

    init() {
        this.cacheDomElements();
        this.bindEvents();
        this.renderCart();
    }

    cacheDomElements() {
        this.cartContent = document.querySelector('.cartc-content');
        this.totalPriceElement = document.querySelector('.total-price');
        this.payBtn = document.querySelector('.checkout');
    }

    bindEvents() {
        // Listen for add-to-cart events from script.js
        window.addEventListener('addToCart', (e) => {
            this.addItem(e.detail);
        });

        // Checkout button
        if (this.payBtn) {
            this.payBtn.addEventListener('click', () => this.handleCheckout());
        }
    }

    addItem({ imgSrc, title, price }) {
        const cleanPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
        const existingItem = this.cartItems.find(item => item.title === title);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({
                imgSrc,
                title,
                price: cleanPrice,
                quantity: 1
            });
        }

        this.saveCart();
        this.renderCart();
    }

    renderCart() {
        this.cartContent.innerHTML = '';
        this.cartItems.forEach(item => {
            const cartBox = document.createElement('div');
            cartBox.classList.add('cart-box');
            cartBox.innerHTML = `
                <img src="${item.imgSrc}" class="cartc-img">
                <div class="cartc-detail">
                    <h2 class="cartc-product-title">${item.title}</h2>
                    <span>$${item.price.toFixed(2)}</span>
                    <div class="cartc-quantity">
                        <button class="decrement">-</button>
                        <span>${item.quantity}</span>
                        <button class="increment">+</button>
                    </div>
                </div>
                <i class="fa fa-trash cart-remove"></i>
            `;

            // Add event listeners
            cartBox.querySelector('.increment').addEventListener('click', () => this.updateQuantity(item.title, 1));
            cartBox.querySelector('.decrement').addEventListener('click', () => this.updateQuantity(item.title, -1));
            cartBox.querySelector('.cart-remove').addEventListener('click', () => this.removeItem(item.title));

            this.cartContent.appendChild(cartBox);
        });
        this.updateTotal();
    }

    updateQuantity(title, change) {
        const item = this.cartItems.find(item => item.title === title);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) this.removeItem(title);
            else this.saveCart();
        }
    }

    removeItem(title) {
        this.cartItems = this.cartItems.filter(item => item.title !== title);
        this.saveCart();
        this.renderCart();
    }

    updateTotal() {
        const total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (this.totalPriceElement) {
            this.totalPriceElement.textContent = `$${total.toFixed(2)}`;
        }
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        this.updateTotal();
    }

    async handleCheckout() {
        try {
            if (this.cartItems.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            const response = await fetch('/stripe-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: this.cartItems.map(item => ({
                        title: item.title,
                        price: item.price.toString(),
                        productImgSrc: item.imgSrc,
                        quantity: item.quantity
                    }))
                })
            });

            if (!response.ok) throw new Error('Checkout failed');

            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Payment failed. Please try again.');
        }
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => new CartSystem());*/

class CartSystem {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.cartCounters = document.querySelectorAll('.cart-counter');
        this.init();
    }

    init() {
        this.cacheDomElements();
        this.bindCartEvents();
        this.renderCart();
        this.updateCartCounter();
    }

    cacheDomElements() {
        this.cartContent = document.querySelector('.cartc-content');
        this.totalPriceElement = document.querySelector('.total-price');
        this.payBtn = document.querySelector('.checkout');
        this.cart = document.querySelector('.cartc');
        this.cartCloseBtn = document.querySelector('#cart-close');
    }

    bindCartEvents() {
        // Close cart button
        if (this.cartCloseBtn) {
            this.cartCloseBtn.addEventListener('click', () => this.toggleCart());
        }

        // Checkout button
        if (this.payBtn) {
            this.payBtn.addEventListener('click', () => this.handleCheckout());
        }

        // Listen for add-to-cart events from script.js
        window.addEventListener('addToCart', (e) => {
            this.addItem(e.detail);
        });
    }

    toggleCart() {
        this.cart.classList.toggle('active');
    }

    addItem({ imgSrc, title, price }) {
        const cleanPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
        const existingItem = this.cartItems.find(item => item.title === title);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({
                imgSrc,
                title,
                price: cleanPrice,
                quantity: 1
            });
        }

        this.saveCart();
        this.renderCart();
        this.updateCartCounter();
    }

    renderCart() {
        if (!this.cartContent) return;

        this.cartContent.innerHTML = this.cartItems.length === 0
            ? '<p class="empty-cart">Your cart is empty</p>'
            : this.cartItems.map(item => this.createCartItemHTML(item)).join('');

        this.attachCartItemEvents();
        this.updateTotal();
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-box" data-title="${encodeURIComponent(item.title)}">
                <img src="${item.imgSrc}" class="cartc-img">
                <div class="cartc-detail">
                    <h2 class="cartc-product-title">${item.title}</h2>
                    <span>$${item.price.toFixed(2)}</span>
                    <div class="cartc-quantity">
                        <button class="decrement">-</button>
                        <span>${item.quantity}</span>
                        <button class="increment">+</button>
                    </div>
                </div>
                <i class="fa fa-trash cart-remove"></i>
            </div>
        `;
    }

    attachCartItemEvents() {
        this.cartItems.forEach(item => {
            const itemElement = document.querySelector(`.cart-box[data-title="${encodeURIComponent(item.title)}"]`);
            if (!itemElement) return;

            itemElement.querySelector('.increment').addEventListener('click', () => {
                this.updateQuantity(item.title, 1);
            });

            itemElement.querySelector('.decrement').addEventListener('click', () => {
                this.updateQuantity(item.title, -1);
            });

            itemElement.querySelector('.cart-remove').addEventListener('click', () => {
                this.removeItem(item.title);
            });
        });
    }

    updateQuantity(title, change) {
        const item = this.cartItems.find(item => item.title === title);
        if (!item) return;

        item.quantity += change;
        if (item.quantity < 1) {
            this.removeItem(title);
        } else {
            this.saveCart();
            this.renderCart();
        }
        this.updateCartCounter();
    }

    removeItem(title) {
        this.cartItems = this.cartItems.filter(item => item.title !== title);
        this.saveCart();
        this.renderCart();
        this.updateCartCounter();
    }

    updateTotal() {
        if (!this.totalPriceElement) return;
        const total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.totalPriceElement.textContent = `$${total.toFixed(2)}`;
    }

    updateCartCounter() {
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCounters.forEach(counter => {
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    async handleCheckout() {
        try {
            if (this.cartItems.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            const response = await fetch('/stripe-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: this.cartItems.map(item => ({
                        title: item.title,
                        price: item.price.toString(),
                        productImgSrc: item.imgSrc,
                        quantity: item.quantity
                    }))
                })
            });

            if (!response.ok) throw new Error('Checkout failed');
            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Payment failed. Please try again.');
        }
    }
}

// Initialize cart when DOM loads
document.addEventListener('DOMContentLoaded', () => new CartSystem());