
const products = [
  {id:1, name:'Takoyaki (Octobits)', category:'Takoyaki', price:60, desc:'Classic takoyaki · 4 pcs', img:'assets/takoyaki-coffee-menu.jpg'},
  {id:2, name:'Meatsy-Yaki (Ham & Cheese)', category:'Takoyaki', price:55, desc:'Ham and cheese · 4 pcs', img:'assets/takoyaki-coffee-menu.jpg'},
  {id:3, name:'Kan iyaki (Crabstick)', category:'Takoyaki', price:55, desc:'Crabstick flavor · 4 pcs', img:'assets/takoyaki-coffee-menu.jpg'},
  {id:4, name:'Cheesy Takoyaki', category:'Takoyaki', price:80, desc:'Cheesy favorite · 4 pcs', img:'assets/takoyaki-coffee-menu.jpg'},

  {id:5, name:'Wings N’ Rice', category:'Wings', price:110, desc:'Chicken wings with rice', img:'assets/chicken-wings.jpg'},
  {id:6, name:'Dozen Wings', category:'Wings', price:349, desc:'12 pieces', img:'assets/chicken-wings.jpg'},
  {id:7, name:'Regular Wings', category:'Wings', price:519, desc:'18 pieces', img:'assets/chicken-wings.jpg'},
  {id:8, name:'Family Wings', category:'Wings', price:649, desc:'24 pieces', img:'assets/chicken-wings.jpg'},

  {id:9, name:'Pork Sisig with Rice', category:'Meals', price:120, desc:'Pork sisig with rice', img:'assets/rice-meals.jpg'},
  {id:10, name:'Chicken Sisig with Rice', category:'Meals', price:100, desc:'Chicken sisig with rice', img:'assets/rice-meals.jpg'},
  {id:11, name:'Beef Burger Steak', category:'Meals', price:85, desc:'Burger steak with rice', img:'assets/rice-meals.jpg'},
  {id:12, name:'Tapa Silog', category:'Meals', price:100, desc:'Silog meal', img:'assets/rice-meals.jpg'},
  {id:13, name:'Tocino Silog', category:'Meals', price:70, desc:'Silog meal', img:'assets/rice-meals.jpg'},

  {id:14, name:'Bacon Mushroom Melt', category:'Burgers', price:100, desc:'Ala carte burger', img:'assets/burgers-sandwiches.jpg'},
  {id:15, name:'Cheesy Beef Burger', category:'Burgers', price:90, desc:'Cheesy beef burger', img:'assets/burgers-sandwiches.jpg'},
  {id:16, name:'Clubhouse Sandwich', category:'Burgers', price:90, desc:'Classic clubhouse sandwich', img:'assets/burgers-sandwiches.jpg'},
  {id:17, name:'Ham & Cheese Sandwich', category:'Burgers', price:60, desc:'Ham and cheese sandwich', img:'assets/burgers-sandwiches.jpg'},

  {id:18, name:'French Fries', category:'Snacks', price:30, desc:'Solo serving', img:'assets/finger-foods.jpg'},
  {id:19, name:'Cheese Sticks', category:'Snacks', price:35, desc:'Crispy snack', img:'assets/finger-foods.jpg'},
  {id:20, name:'Hash Brown', category:'Snacks', price:29, desc:'Golden hash brown', img:'assets/finger-foods.jpg'},

  {id:21, name:'Americano Iced Coffee', category:'Drinks', price:55, desc:'12 oz', img:'assets/iced-coffee.jpg'},
  {id:22, name:'Latte Iced Coffee', category:'Drinks', price:65, desc:'12 oz', img:'assets/iced-coffee.jpg'},
  {id:23, name:'Spanish Latte', category:'Drinks', price:80, desc:'12 oz', img:'assets/iced-coffee.jpg'},
  {id:24, name:'Classic Milk Tea', category:'Drinks', price:35, desc:'12 oz', img:'assets/milktea.jpg'},
  {id:25, name:'Nutella Milk Tea', category:'Drinks', price:80, desc:'16 oz', img:'assets/milktea.jpg'},
  {id:26, name:'Chocolate Frappe', category:'Drinks', price:60, desc:'12 oz', img:'assets/frappe.jpg'},
  {id:27, name:'Matcha Frappe', category:'Drinks', price:60, desc:'12 oz', img:'assets/frappe.jpg'},
  {id:28, name:'Fruit Tea', category:'Drinks', price:50, desc:'12 oz', img:'assets/beverages.jpg'}
];

const money = number =>
  '₱' + number.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

let cart = {};
let currentCategory = 'All';

const menuGrid = document.getElementById('menuGrid');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const checkoutModal = document.getElementById('checkoutModal');

/* DISPLAY MENU */

function renderMenu() {
  const list = currentCategory === 'All'
    ? products
    : products.filter(product =>
        product.category === currentCategory
      );

  menuGrid.innerHTML = list.map(product => `
    <article class="menu-card">
      <img
        loading="lazy"
        src="${product.img}"
        alt="${product.name}"
        onerror="this.src='assets/logo.jpg'"
      >

      <div class="menu-card-body">
        <span class="tag">${product.category}</span>

        <h3>${product.name}</h3>

        <p>${product.desc}</p>

        <div class="price-line">
          <span class="price">${money(product.price)}</span>

          <button
            class="add-btn"
            onclick="addToCart(${product.id})">
            + Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join('');
}


document.getElementById('categoryRow')
  .addEventListener('click', event => {

    const button = event.target.closest('[data-category]');

    if (!button) return;

    currentCategory = button.dataset.category;

    document.querySelectorAll('.chip')
      .forEach(chip => {
        chip.classList.toggle('active', chip === button);
      });

    renderMenu();
  });


function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;

  renderCart();

  showToast(
    products.find(product => product.id === id).name +
    ' added to cart'
  );
}


function changeQty(id, amount) {
  cart[id] = (cart[id] || 0) + amount;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  renderCart();
}


function getSubtotal() {
  return Object.entries(cart).reduce(
    (total, [id, quantity]) => {
      const product = products.find(
        item => item.id === Number(id)
      );

      return total + product.price * quantity;
    },
    0
  );
}

/* DISPLAY CART */

function renderCart() {
  const entries = Object.entries(cart);

  const totalItems = entries.reduce(
    (total, [, quantity]) => total + quantity,
    0
  );

  document.getElementById('cartCount').textContent =
    totalItems;

  document.getElementById('subtotal').textContent =
    money(getSubtotal());

  document.getElementById('grandTotal').textContent =
    money(getSubtotal());

  document.getElementById('cartItems').innerHTML =
    entries.length
      ? entries.map(([id, quantity]) => {

          const product = products.find(
            item => item.id === Number(id)
          );

          return `
            <div class="cart-item">

              <div>
                <h4>${product.name}</h4>

                <small>${money(product.price)} each</small>

                <div class="qty">
                  <button onclick="changeQty(${product.id}, -1)">−</button>

                  <strong>${quantity}</strong>

                  <button onclick="changeQty(${product.id}, 1)">+</button>
                </div>
              </div>

              <strong>
                ${money(product.price * quantity)}
              </strong>

            </div>
          `;
        }).join('')

      : `
        <div class="empty">
          <h3>Your cart is empty</h3>
          <p>Add something yummy from the menu!</p>
        </div>
      `;

  document.getElementById('checkoutSummary').textContent =
    entries.length
      ? `${totalItems} item(s) · Subtotal ${money(getSubtotal())}`
      : 'Your cart is empty.';
}


function openCart() {
  cartDrawer.classList.add('open');
  overlay.classList.add('open');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('open');
}

document.getElementById('openCart')
  .addEventListener('click', openCart);

document.getElementById('closeCart')
  .addEventListener('click', closeCart);

overlay.addEventListener('click', closeCart);


document.getElementById('checkoutButton')
  .addEventListener('click', () => {

    if (Object.keys(cart).length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    closeCart();

    document.getElementById('orderResult').hidden = true;
    document.getElementById('checkoutForm').hidden = false;

    checkoutModal.classList.add('open');
  });

document.getElementById('closeCheckout')
  .addEventListener('click', () => {
    checkoutModal.classList.remove('open');
  });


document.getElementById('ctaMenu')
  .addEventListener('click', () => {
    document.getElementById('menu')
      .scrollIntoView({ behavior: 'smooth' });
  });


document.getElementById('checkoutForm')
  .addEventListener('submit', event => {

    event.preventDefault();

    if (Object.keys(cart).length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    const value = id =>
      document.getElementById(id).value.trim();

    const orderLines = Object.entries(cart).map(
      ([id, quantity]) => {

        const product = products.find(
          item => item.id === Number(id)
        );

        return `• ${product.name} x${quantity} — ${
          money(product.price * quantity)
        }`;
      }
    );

    const orderSummary = `
RAMOS & RAMOS FOOD CORNER
ORDER SUMMARY

Customer: ${value('customerName')}
Contact: ${value('customerPhone')}
Address: ${value('customerAddress')}

Order Type: ${value('orderType')}
Payment: ${value('paymentMethod')}

ITEMS:
${orderLines.join('\n')}

Subtotal: ${money(getSubtotal())}
Delivery Fee: To be confirmed

Notes: ${value('orderNotes') || 'None'}

Please confirm availability, final prices,
delivery fee, and payment instructions
with the store.
`;

    document.getElementById('orderText').value =
      orderSummary;

    document.getElementById('checkoutForm').hidden = true;
    document.getElementById('orderResult').hidden = false;
  });


document.getElementById('copyOrder')
  .addEventListener('click', async () => {

    const text = document.getElementById('orderText');

    try {
      await navigator.clipboard.writeText(text.value);
      showToast('Order summary copied!');
    } catch (error) {
      text.select();
      document.execCommand('copy');
      showToast('Order summary selected for copying.');
    }
  });


let toastTimer;

function showToast(message) {
  const toast = document.getElementById('toast');

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}



document.getElementById('year').textContent =
  new Date().getFullYear();



renderMenu();
renderCart();
