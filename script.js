document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenuBtn = document.querySelector('.close-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Cart System ---
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalEl = document.querySelector('.total-amount');
    const cartCountEl = document.querySelector('.cart-count');
    const cartIconWrapper = document.querySelector('.cart-icon-wrapper');
    const closeCartBtn = document.querySelector('.close-cart');

    let cart = [];

    // Open/Close Cart
    function toggleCart() {
        cartOverlay.classList.toggle('active');
        document.body.style.overflow = cartOverlay.classList.contains('active') ? 'hidden' : '';
    }

    cartIconWrapper.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) toggleCart();
    });

    // Add to Cart Logic
    document.querySelectorAll('.add-to-cart, .pricing-card button').forEach(btn => {
        btn.addEventListener('click', function (e) {
            // Determine item details based on button type
            let name, price;

            // If it's the pricing card subscribe button
            if (this.closest('.pricing-card')) {
                const card = this.closest('.pricing-card');
                name = card.querySelector('h3').innerText.split(' ').slice(1).join(' '); // remove emoji if simple split
                // Better name extraction:
                name = card.querySelector('h3').innerText;
                const priceText = card.querySelector('.price-tag').innerText;
                // Clean price text to number
                price = parseInt(priceText.replace(/[^0-9]/g, ''));
            } else {
                // Product card
                name = this.dataset.name;
                price = parseInt(this.dataset.price);
            }

            addItemToCart(name, price);

            // Visual Feedback
            const originalText = this.innerText;
            this.innerText = 'Added! ✓';
            this.style.backgroundColor = 'var(--success-color)';
            if (this.classList.contains('btn-outline')) {
                this.style.color = 'white';
                this.style.borderColor = 'var(--success-color)';
            }

            // Animate Cart Icon
            cartCountEl.style.transform = 'scale(1.5)';
            setTimeout(() => cartCountEl.style.transform = 'scale(1)', 200);

            setTimeout(() => {
                this.innerText = originalText;
                this.removeAttribute('style'); // Clear inline styles to revert to CSS
            }, 1000);

            // Auto open cart for better UX (optional, but requested "functional")
            // toggleCart(); 
        });
    });

    function addItemToCart(name, price) {
        cart.push({ name, price, id: Date.now() });
        updateCartUI();
    }

    function removeItemFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    }

    function updateCartUI() {
        // Update Count
        cartCountEl.innerText = cart.length;

        // Update Total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalEl.innerText = '₹' + total.toLocaleString();

        // Render Items
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your basket is empty.</div>';
        } else {
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                    </div>
                    <button class="remove-item" onclick="removeItem(${item.id})">Remove</button>
                `;
                // Add event listener directly to avoid global scope issues
                itemEl.querySelector('.remove-item').onclick = () => removeItemFromCart(item.id);
                cartItemsContainer.appendChild(itemEl);
            });
        }
    }

    // --- Checkout Logic ---
    const checkoutBtn = document.querySelector('.checkout-btn');
    const cartItemsDiv = document.querySelector('.cart-items');
    const cartFooter = document.querySelector('.cart-footer');
    const checkoutFormContainer = document.querySelector('.checkout-form-container');
    const backToCartBtn = document.querySelector('.back-to-cart');
    const checkoutForm = document.getElementById('checkout-form');

    // Go to Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Switch Views
        cartItemsDiv.style.display = 'none';
        cartFooter.style.display = 'none';
        checkoutFormContainer.style.display = 'block';
    });

    // Back to Cart
    backToCartBtn.addEventListener('click', () => {
        cartItemsDiv.style.display = 'block';
        cartFooter.style.display = 'block';
        checkoutFormContainer.style.display = 'none';
    });

    // Place Order
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.querySelector('.place-order-btn');
        const originalText = btn.innerText;
        btn.innerText = 'Placing Order...';
        btn.disabled = true;

        const name = document.getElementById('order-name').value;
        const phone = document.getElementById('order-phone').value;
        const address = document.getElementById('order-address').value;

        // Construct Order Summary
        const itemsList = cart.map(item => `- ${item.name}: ₹${item.price}`).join('\n');
        const total = cartTotalEl.innerText;

        const fullMessage = `📦 NEW ORDER\n\n👤 Customer: ${name}\n📞 Phone: ${phone}\n📍 Address: ${address}\n\n🛒 Items:\n${itemsList}\n\n💰 TOTAL: ${total}`;

        try {
            // DIRECT TELEGRAM API CALL (No server needed!)
            const BOT_TOKEN = '8208572285:AAFc852ARPC8WPLgjYQLq8Y8JmBY7QdOd1o';
            const CHAT_ID = '1957565921';

            const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

            const response = await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: fullMessage
                })
            });

            const result = await response.json();

            if (result.ok) {
                alert(`Order Placed Successfully! 🎉\n\nWe have received your order details.\nTotal to Pay: ${total}`);

                // Reset Cart & UI
                cart = [];
                updateCartUI();
                checkoutForm.reset();
                toggleCart();

                // Reset View
                cartItemsDiv.style.display = 'block';
                cartFooter.style.display = 'block';
                checkoutFormContainer.style.display = 'none';
            } else {
                alert('Order Failed: ' + (result.description || 'Telegram API error'));
            }
        } catch (error) {
            console.error('Order Error:', error);
            alert('Failed to place order. Please check your internet connection.');
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });


    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const nameInput = contactForm.querySelector('input[type="text"]');
        const emailInput = contactForm.querySelector('input[type="email"]');
        const msgInput = contactForm.querySelector('textarea');

        const name = nameInput.value;
        const email = emailInput.value;
        const message = msgInput.value;

        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        try {
            // DIRECT TELEGRAM API CALL
            const BOT_TOKEN = '8208572285:AAFc852ARPC8WPLgjYQLq8Y8JmBY7QdOd1o';
            const CHAT_ID = '1957565921';

            const text = `💬 Contact Form\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text
                })
            });

            const result = await response.json();

            if (result.ok) {
                alert('Success! Message sent to our Team.');
                contactForm.reset();
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Could not send message. Please check your internet connection.');
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });

    // --- Language Selector ---
    const langSelector = document.querySelector('.lang-selector');
    langSelector.addEventListener('click', () => {
        alert('Language selection is currently simulating English (US) / English (India).');
    });

    // --- Intersection Observer (Keep existing) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
});

// Banana Varieties Modal Functions
function showBananaVarieties() {
    const modal = document.getElementById('bananaModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBananaVarieties() {
    const modal = document.getElementById('bananaModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Apple Varieties Modal Functions
function showAppleVarieties() {
    const modal = document.getElementById('appleModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAppleVarieties() {
    const modal = document.getElementById('appleModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Orange Varieties Modal Functions
function showOrangeVarieties() {
    const modal = document.getElementById('orangeModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOrangeVarieties() {
    const modal = document.getElementById('orangeModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    const bananaModal = document.getElementById('bananaModal');
    const appleModal = document.getElementById('appleModal');
    const orangeModal = document.getElementById('orangeModal');

    if (e.target === bananaModal) {
        closeBananaVarieties();
    }
    if (e.target === appleModal) {
        closeAppleVarieties();
    }
    if (e.target === orangeModal) {
        closeOrangeVarieties();
    }
});
