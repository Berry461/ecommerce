/*// Mobile menu toggle
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) bar.addEventListener('click', () => nav.classList.add('active'));
if (close) close.addEventListener('click', () => nav.classList.remove('active'));

// Cart toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const cartIconDesktop = document.querySelector('#lg-bag');
    const cartIconMobile = document.querySelector('#lg-bag-mobile');
    const cart = document.querySelector('.cartc');
    const cartClose = document.querySelector('#cart-close');

    const showCart = () => cart.classList.add('active');
    const hideCart = () => cart.classList.remove('active');

    if (cartIconDesktop) cartIconDesktop.addEventListener('click', showCart);
    if (cartIconMobile) cartIconMobile.addEventListener('click', showCart);
    if (cartClose) cartClose.addEventListener('click', hideCart);
});

// Product interactions
document.querySelectorAll('.pro .cart').forEach(button => {
    button.addEventListener('click', () => {
        const productBox = button.closest('.pro');
        if (productBox) {
            // This will be handled by cart.js
            window.dispatchEvent(new CustomEvent('addToCart', {
                detail: {
                    imgSrc: productBox.querySelector('.product-img').src,
                    title: productBox.querySelector('.product-title').textContent,
                    price: productBox.querySelector('.price').textContent
                }
            }));
        }
    });
});*/

// Mobile menu toggle
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) bar.addEventListener('click', () => nav.classList.add('active'));
if (close) close.addEventListener('click', () => nav.classList.remove('active'));

// Cart toggle functionality - now just triggers the cart system's toggle
document.addEventListener('DOMContentLoaded', () => {
    const cartIconDesktop = document.querySelector('#lg-bag');
    const cartIconMobile = document.querySelector('#lg-bag-mobile');

    if (cartIconDesktop) {
        cartIconDesktop.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.cartc').classList.toggle('active');
        });
    }

    if (cartIconMobile) {
        cartIconMobile.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.cartc').classList.toggle('active');
        });
    }
});

// Product interactions - just dispatch events to cart system
document.querySelectorAll('.pro .cart').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productBox = button.closest('.pro');
        if (productBox) {
            window.dispatchEvent(new CustomEvent('addToCart', {
                detail: {
                    imgSrc: productBox.querySelector('.product-img').src,
                    title: productBox.querySelector('.product-title').textContent,
                    price: productBox.querySelector('.price').textContent
                }
            }));
        }
    });
});

