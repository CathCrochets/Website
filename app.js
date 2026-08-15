const products = [
  { id: 'pumpkin-hat', name: 'Pumpkin Cat Hat', fullName: 'Pumpkin Cat Hat, Crochet Bucket Hat for Pets', price: 15.29, category: 'cat-hats', categoryLabel: 'Cat hats', image: 'assets/pumpkin-cat-hat.png', badge: 'Bestseller', stock: 3, description: 'A bright, squashy pumpkin hat made for cats and small dogs. The soft ties keep it comfortably in place for photos and fancy dress.' },
  { id: 'bunny-hat', name: 'Easter Bunny Cat Hat', fullName: 'Easter Bunny Cat Hat: Handmade Small Pet Costume', price: 14.29, category: 'cat-hats', categoryLabel: 'Cat hats', image: 'assets/bunny-cat-hat.png', badge: 'Lola loves it', stock: 4, description: 'Soft pink-lined bunny ears for an instant dose of springtime silliness. Handmade in a comfortable, lightweight yarn.' },
  { id: 'daisy-kindle', name: 'Daisy Kindle Sleeve', fullName: 'Daisy Crochet Kindle Sleeve with Button', price: 18.89, category: 'tech-cases', categoryLabel: 'Tech cases', image: 'assets/daisy-kindle-sleeve.png', badge: 'Made to order', stock: 5, description: 'A mint-green crochet sleeve with cheerful hand-stitched daisies and a wooden button closure to keep your reader cosy.' },
  { id: 'lilac-kindle', name: 'Lilac Kindle Sleeve', fullName: 'Crochet Kindle Sleeve with Button — 20 Colours', price: 17.29, category: 'tech-cases', categoryLabel: 'Tech cases', image: 'assets/lilac-kindle-sleeve.png', badge: '20 colours', stock: 7, description: 'A tactile, made-to-order e-reader sleeve with a secure button tab. Choose from twenty colours to make it completely yours.' },
  { id: 'carrot-hat', name: 'Carrot Cat Hat', fullName: 'Carrot Cat Hat, Crochet Bucket Hat for Pets', price: 15.29, category: 'cat-hats', categoryLabel: 'Cat hats', image: 'assets/carrot-cat-hat.png', badge: 'New', stock: 2, description: 'A wonderfully silly orange carrot hat with a leafy green top, soft ear openings and ties for a comfy fit.' },
  { id: 'ear-warmer', name: 'Cat Ear Warmer Hat', fullName: 'Crochet Cat Ear Warmer Hat with Cat Ears', price: 11.89, category: 'cat-hats', categoryLabel: 'Cat hats', image: 'assets/cat-ear-warmer.png', badge: 'Only 1 left', stock: 1, description: 'A soft, cosy ear warmer made for chilly cats and small dogs, finished with tiny pointed ears and gentle ties.' },
  { id: 'tamagotchi', name: 'Tamagotchi Paradise Case', fullName: 'Tamagotchi Paradise Fluffy Soft Case', price: 10.49, category: 'tech-cases', categoryLabel: 'Tech cases', image: 'assets/tamagotchi-case.png', badge: 'Only 1 left', stock: 1, description: 'A sunshine-yellow fluffy case that hugs your Tamagotchi while keeping the screen and buttons easy to reach.' },
  { id: 'switch-bell', name: 'Switch 2 Bell Bag Case', fullName: 'Nintendo Switch 2 Crochet Case — Bell Bag', price: 18.89, category: 'tech-cases', categoryLabel: 'Tech cases', image: 'assets/switch-bell-bag.png', badge: 'Only 1 left', stock: 1, description: 'A drawstring console sleeve inspired by a familiar bell bag. Soft yarn helps protect your Switch 2 while travelling.' },
  { id: 'switch-blue', name: 'Switch 2 Crochet Case', fullName: 'Switch 2 Crochet Case — 20 Colours Available', price: 18.89, category: 'tech-cases', categoryLabel: 'Tech cases', image: 'assets/switch-blue-case.png', badge: '20 colours', stock: 3, description: 'A snug button-close Switch 2 sleeve with a soft crochet texture. Pick the colour that suits your setup.' },
  { id: 'bandana', name: 'Rainbow Cat Bandana', fullName: 'Crochet Cat Head Scarf Bandana — Rainbow', price: 12.89, category: 'cat-hats', categoryLabel: 'Cat hats', image: 'assets/rainbow-cat-bandana.png', badge: 'Colourful pick', stock: 2, description: 'A rainbow crochet head scarf with a lightweight fit, created for cats and small dogs who like a little extra flair.' },
  { id: 'stickers', name: 'Stardew Valley Sticker Sheet', fullName: 'Stardew Valley Inspired Sticker Sheet', price: 4.00, category: 'gifts', categoryLabel: 'Little gifts', image: 'assets/stardew-stickers.png', badge: 'Only 2 left', stock: 2, description: 'A cute collection of pixel-style farm and game-inspired stickers, ready for journals, laptops and happy mail.' },
  { id: 'tumbler', name: 'Dog Lover Glass Tumbler', fullName: 'Funny Glass Tumbler for Dog Lovers', price: 15.00, category: 'gifts', categoryLabel: 'Little gifts', image: 'assets/dog-lover-tumbler.png', badge: 'Gift idea', stock: 4, description: 'A playful glass tumbler with pink lettering, bamboo lid and reusable straw — for anyone delayed by a very important dog.' }
];

const state = {
  category: 'all',
  query: '',
  sort: 'featured',
  cart: loadCart()
};

const grid = document.querySelector('#product-grid');
const count = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const search = document.querySelector('#product-search');
const sort = document.querySelector('#product-sort');
const productDialog = document.querySelector('#product-dialog');
const productDialogContent = document.querySelector('#product-dialog-content');
const cartDrawer = document.querySelector('#cart-drawer');
const cartItems = document.querySelector('#cart-items');
const cartEmpty = document.querySelector('#cart-empty');
const cartSummary = document.querySelector('#cart-summary');
const backdrop = document.querySelector('.drawer-backdrop');
const toast = document.querySelector('#toast');
const checkoutDialog = document.querySelector('#checkout-dialog');
const legalDialog = document.querySelector('#legal-dialog');

function money(value) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
}

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem('cath-crochets-cart'));
    return Array.isArray(stored) ? stored.filter(item => products.some(product => product.id === item.id)) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try { localStorage.setItem('cath-crochets-cart', JSON.stringify(state.cart)); } catch { /* Storage may be unavailable in private browsing. */ }
}

function getVisibleProducts() {
  const query = state.query.trim().toLowerCase();
  const filtered = products.filter(product => {
    const matchesCategory = state.category === 'all' || product.category === state.category;
    const haystack = `${product.name} ${product.fullName} ${product.categoryLabel} ${product.description}`.toLowerCase();
    return matchesCategory && (!query || haystack.includes(query));
  });

  if (state.sort === 'price-asc') return filtered.sort((a, b) => a.price - b.price);
  if (state.sort === 'price-desc') return filtered.sort((a, b) => b.price - a.price);
  if (state.sort === 'name') return filtered.sort((a, b) => a.name.localeCompare(b.name));
  return filtered;
}

function renderProducts() {
  const visible = getVisibleProducts();
  count.textContent = visible.length;
  emptyState.hidden = visible.length !== 0;
  grid.hidden = visible.length === 0;
  grid.innerHTML = visible.map(product => `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrap" data-open-product="${product.id}" tabindex="0" role="button" aria-label="View ${product.name}">
        <span class="product-badge">${product.badge}</span>
        <img src="${product.image}" alt="${product.fullName}" loading="lazy">
        <button class="product-quick" type="button" data-open-product="${product.id}" aria-label="Quick view ${product.name}">↗</button>
      </div>
      <div class="product-meta">
        <p class="product-category">${product.categoryLabel}</p>
        <h3><button type="button" data-open-product="${product.id}">${product.name}</button></h3>
        <div class="product-bottom"><span class="product-price">${money(product.price)}</span><button class="product-add" type="button" data-add-product="${product.id}">Add to basket +</button></div>
      </div>
    </article>`).join('');
}

function selectCategory(category) {
  state.category = category;
  document.querySelectorAll('.category-chip').forEach(button => {
    const active = button.dataset.category === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderProducts();
}

function openProduct(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  const options = product.category === 'cat-hats'
    ? '<li>✓ Soft ties and comfortable ear openings</li><li>✓ Standard size fits most cats and small dogs</li>'
    : product.category === 'tech-cases'
      ? '<li>✓ Soft, protective crochet texture</li><li>✓ Handmade to fit the listed device</li>'
      : '<li>✓ Small-batch handmade or designed by Cath</li><li>✓ Packed carefully in Newcastle</li>';

  productDialogContent.innerHTML = `
    <div class="product-dialog-layout">
      <img class="dialog-product-image" src="${product.image}" alt="${product.fullName}">
      <div class="dialog-product-copy">
        <p class="product-category">${product.categoryLabel} · ${product.badge}</p>
        <h2>${product.name}</h2>
        <p class="dialog-product-price">${money(product.price)}</p>
        <p>${product.description}</p>
        <ul class="dialog-product-list">${options}<li>✓ Dispatch estimate: 2–4 working days</li><li>✓ Handmade in Newcastle upon Tyne</li></ul>
        <button class="button button-primary" type="button" data-dialog-add="${product.id}">Add to basket <span>→</span></button>
        <p class="dialog-smallprint">UK delivery £3.50 · free when you spend £35</p>
      </div>
    </div>`;
  productDialog.showModal();
}

function addToCart(productId, open = false) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  const existing = state.cart.find(item => item.id === productId);
  if (existing) existing.quantity = Math.min(existing.quantity + 1, product.stock);
  else state.cart.push({ id: productId, quantity: 1 });
  saveCart();
  renderCart();
  showToast(`${product.name} added to your basket`);
  if (open) openCart();
}

function changeQuantity(productId, delta) {
  const item = state.cart.find(entry => entry.id === productId);
  const product = products.find(entry => entry.id === productId);
  if (!item || !product) return;
  item.quantity = Math.max(0, Math.min(product.stock, item.quantity + delta));
  if (item.quantity === 0) state.cart = state.cart.filter(entry => entry.id !== productId);
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

function cartTotals() {
  const subtotal = state.cart.reduce((sum, item) => {
    const product = products.find(entry => entry.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const shipping = subtotal >= 35 || subtotal === 0 ? 0 : 3.5;
  return { subtotal, shipping, total: subtotal + shipping };
}

function renderCart() {
  const quantity = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count, .cart-count-inline').forEach(element => { element.textContent = quantity; });
  cartEmpty.hidden = state.cart.length !== 0;
  cartSummary.hidden = state.cart.length === 0;
  cartItems.innerHTML = state.cart.map(item => {
    const product = products.find(entry => entry.id === item.id);
    if (!product) return '';
    return `<article class="cart-item">
      <img src="${product.image}" alt="">
      <div><h3>${product.name}</h3><p>${money(product.price)}</p><div class="quantity-control" aria-label="Quantity"><button type="button" data-quantity="-1" data-product="${product.id}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-quantity="1" data-product="${product.id}" aria-label="Increase quantity">+</button></div></div>
      <button class="remove-item" type="button" data-remove-product="${product.id}">Remove</button>
    </article>`;
  }).join('');

  const totals = cartTotals();
  document.querySelector('#cart-subtotal').textContent = money(totals.subtotal);
  document.querySelector('#cart-shipping').textContent = totals.shipping === 0 ? 'Free' : money(totals.shipping);
  document.querySelector('#cart-total').textContent = money(totals.total);
  const remaining = Math.max(0, 35 - totals.subtotal);
  document.querySelector('#shipping-message').textContent = remaining > 0 ? `Spend ${money(remaining)} more for free UK delivery.` : 'You’ve unlocked free UK delivery!';
}

function openCart() {
  cartDrawer.classList.add('open');
  backdrop.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  cartDrawer.querySelector('.close-button').focus();
}

function closeCart() {
  cartDrawer.classList.remove('open');
  backdrop.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

const policies = {
  privacy: `
    <p class="eyebrow"><span></span> Last updated 15 August 2026</p><h2>Privacy notice</h2>
    <p>Cath Crochets is an independent shop based in Newcastle upon Tyne, United Kingdom. This notice explains how personal information would be used when the site is connected to live services.</p>
    <h3>Information collected</h3><p>When you place an order or send an enquiry, the shop may receive your name, email address, delivery address, order details and messages. Card details should be handled by the connected payment provider and not stored by Cath Crochets.</p>
    <h3>Why it is used</h3><ul><li>To fulfil orders and provide customer support</li><li>To respond to custom-order enquiries</li><li>To meet tax, accounting and legal obligations</li><li>To send marketing only where you have actively opted in</li></ul>
    <h3>Sharing and retention</h3><p>Information is shared only with services needed to run the shop, such as hosting, payment and delivery providers. Order records may need to be retained for up to six years for UK tax purposes. Enquiries that do not become orders should be deleted when no longer needed.</p>
    <h3>Your rights</h3><p>You may ask to access, correct or erase your information, or object to certain uses. Contact <a href="mailto:cathcrochetsstore@gmail.com">cathcrochetsstore@gmail.com</a>. You may also complain to the UK Information Commissioner’s Office.</p>
    <p><strong>Launch note:</strong> Replace this concept notice with details of the actual hosting, checkout, analytics and email providers before taking live orders.</p>`,
  delivery: `
    <p class="eyebrow"><span></span> Shop policy</p><h2>Delivery &amp; returns</h2>
    <h3>Dispatch</h3><p>Ready-made items normally dispatch within 2–4 working days. Made-to-order and custom pieces have individual lead times, confirmed before purchase. Orders are sent from Newcastle upon Tyne.</p>
    <h3>UK delivery</h3><p>Standard delivery is shown as £3.50 in this concept and free over £35. Final prices and tracked options should be confirmed with the chosen carrier before launch.</p>
    <h3>International delivery</h3><p>International customers may need to pay local import duties or taxes. These are the buyer’s responsibility unless the checkout explicitly says they are included. Customs delays are outside the maker’s control.</p>
    <h3>Returns</h3><p>For eligible standard items, notify Cath within 14 days of delivery and return the item within a further 14 days, unused and in its original condition. Return postage is normally paid by the customer. Personalised or made-to-measure goods may be exempt unless faulty.</p>
    <h3>Problems with an order</h3><p>Email within 48 hours of delivery with the order number and clear photographs of damage or an incorrect item. This does not affect your statutory rights.</p>`,
  terms: `
    <p class="eyebrow"><span></span> Shop policy</p><h2>Terms &amp; conditions</h2>
    <p>These draft terms are written for a UK handmade-goods storefront. Business identity, payment provider details and a service address should be added before launch.</p>
    <h3>Orders</h3><p>An order is accepted when confirmation is sent after successful payment. Cath Crochets may decline and refund an order if an item is unavailable, a pricing error is found, or a custom request cannot safely be fulfilled.</p>
    <h3>Handmade variation</h3><p>Small differences in colour, stitch placement and dimensions are part of a handmade item’s character. Screen colours can also vary. These differences are not faults where the item matches its description.</p>
    <h3>Pet safety</h3><p>Pet accessories are for supervised wear only. Remove an item if the animal shows distress or begins chewing it. They are not toys and should be kept away from unattended animals.</p>
    <h3>Custom work</h3><p>Price, measurements, design and timing will be agreed before work begins. Personalised goods cannot usually be returned unless faulty. Changes requested after making starts may affect price and delivery.</p>
    <h3>Liability and law</h3><p>Nothing limits rights that cannot lawfully be excluded. These terms are governed by the laws of England and Wales. Consumers may bring proceedings in the courts applicable to their home within the UK.</p>`,
  cookies: `
    <p class="eyebrow"><span></span> Your choices</p><h2>Cookie notice</h2>
    <p>This front-end concept uses browser local storage, a cookie-like technology, to remember basket contents and your cookie choice. It does not currently load advertising or analytics trackers.</p>
    <h3>Essential storage</h3><p><strong>cath-crochets-cart</strong> stores basket item IDs and quantities. <strong>cath-cookie-choice</strong> remembers the choice made in the banner. These remain on the device until cleared.</p>
    <h3>Optional services</h3><p>If analytics, embedded social media or marketing tools are added, they must remain off until the visitor consents where UK law requires it. Update this notice with provider names, purposes and expiry periods.</p>
    <h3>Managing storage</h3><p>Use “Cookie settings” in the footer to revisit the banner. Browser settings can also remove stored site data.</p>`
};

function openLegal(key) {
  if (!policies[key]) return;
  document.querySelector('#legal-content').innerHTML = policies[key];
  legalDialog.showModal();
}

function closeDialog(dialog) {
  if (dialog && dialog.open) dialog.close();
}

document.addEventListener('click', event => {
  const category = event.target.closest('[data-category]');
  if (category) selectCategory(category.dataset.category);

  const openProductButton = event.target.closest('[data-open-product]');
  if (openProductButton) openProduct(openProductButton.dataset.openProduct);

  const addButton = event.target.closest('[data-add-product]');
  if (addButton) addToCart(addButton.dataset.addProduct);

  const dialogAdd = event.target.closest('[data-dialog-add]');
  if (dialogAdd) { addToCart(dialogAdd.dataset.dialogAdd, true); closeDialog(productDialog); }

  if (event.target.closest('.cart-button')) openCart();
  if (event.target.closest('[data-close-cart]')) closeCart();

  const quantityButton = event.target.closest('[data-quantity]');
  if (quantityButton) changeQuantity(quantityButton.dataset.product, Number(quantityButton.dataset.quantity));

  const removeButton = event.target.closest('[data-remove-product]');
  if (removeButton) removeFromCart(removeButton.dataset.removeProduct);

  const legalButton = event.target.closest('[data-legal]');
  if (legalButton) openLegal(legalButton.dataset.legal);

  const closeButton = event.target.closest('.dialog-close');
  if (closeButton) closeDialog(closeButton.closest('dialog'));
});

grid.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-open-product][role="button"]')) {
    event.preventDefault();
    openProduct(event.target.dataset.openProduct);
  }
});

search.addEventListener('input', () => { state.query = search.value; renderProducts(); });
sort.addEventListener('change', () => { state.sort = sort.value; renderProducts(); });

document.querySelector('.clear-filters').addEventListener('click', () => {
  search.value = '';
  sort.value = 'featured';
  state.query = '';
  state.sort = 'featured';
  selectCategory('all');
});

document.querySelector('.search-jump').addEventListener('click', () => {
  document.querySelector('#shop').scrollIntoView();
  setTimeout(() => search.focus(), 450);
});

document.querySelectorAll('[data-footer-category]').forEach(link => link.addEventListener('click', () => {
  selectCategory(link.dataset.footerCategory);
}));

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', event => {
  if (event.target.matches('a')) { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); }
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    const inDialog = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inDialog) dialog.close();
  });
});

document.querySelector('.checkout-button').addEventListener('click', () => {
  closeCart();
  const totals = cartTotals();
  document.querySelector('#checkout-recap').innerHTML = `<div><span>${state.cart.reduce((sum, item) => sum + item.quantity, 0)} item(s)</span><strong>${money(totals.subtotal)}</strong></div><div><span>UK delivery</span><strong>${totals.shipping ? money(totals.shipping) : 'Free'}</strong></div><div><strong>Order total</strong><strong>${money(totals.total)}</strong></div>`;
  checkoutDialog.showModal();
});

document.querySelector('#demo-payment').addEventListener('click', () => {
  document.querySelector('#checkout-dialog').innerHTML = `<div style="padding:70px 20px;text-align:center"><div style="font-size:50px">✓</div><h2>That’s the idea!</h2><p>A live payment connection would create the order here, send a receipt and let Cath start making.</p><button class="button button-primary" type="button" id="finish-demo">Return to the shop</button></div>`;
  document.querySelector('#finish-demo').addEventListener('click', () => closeDialog(checkoutDialog));
});

document.querySelector('#enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Custom crochet enquiry from ${data.get('name')}`);
  const body = encodeURIComponent(`Hi Cath,\n\nI'd love to ask about a custom piece.\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nType: ${data.get('type')}\nBudget: ${data.get('budget')}\nNeeded by: ${data.get('date') || 'No fixed date'}\n\nMy idea:\n${data.get('details')}\n\nThanks!`);
  window.location.href = `mailto:cathcrochetsstore@gmail.com?subject=${subject}&body=${body}`;
  showToast('Your email app should open with the enquiry ready');
});

document.querySelector('#newsletter-form').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#newsletter-status').textContent = 'Lovely — this signup is ready to connect to your email platform.';
  event.currentTarget.reset();
});

function setCookieChoice(choice) {
  try { localStorage.setItem('cath-cookie-choice', choice); } catch { /* Nothing to do. */ }
  document.querySelector('#cookie-banner').classList.remove('show');
  showToast(choice === 'all' ? 'Cookie preference saved' : 'Only essential storage will be used');
}

const cookieBanner = document.querySelector('#cookie-banner');
try { if (!localStorage.getItem('cath-cookie-choice')) cookieBanner.classList.add('show'); } catch { cookieBanner.classList.add('show'); }
document.querySelector('#accept-cookies').addEventListener('click', () => setCookieChoice('all'));
document.querySelector('#essential-cookies').addEventListener('click', () => setCookieChoice('essential'));
document.querySelector('#cookie-settings').addEventListener('click', () => cookieBanner.classList.add('show'));

const dateInput = document.querySelector('input[type="date"]');
dateInput.min = new Date().toISOString().split('T')[0];
document.querySelector('#year').textContent = new Date().getFullYear();

renderProducts();
renderCart();
