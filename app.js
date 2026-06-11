/* =============================================
   OnePlus Z2 ANC – App.js
   ============================================= */

'use strict';

// ===== INIT AOS =====
AOS.init({ once: true, duration: 700, easing: 'ease-out-cubic', offset: 60 });

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    // Entrance animations
    gsapEntrance();
  }, 2000);
});

// ===== GSAP ENTRANCE =====
function gsapEntrance() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero text entrance
  gsap.from('.slide.active .slide-eyebrow', { y: 30, opacity: 0, duration: 0.7, delay: 0.2 });
  gsap.from('.slide.active .slide-title', { y: 50, opacity: 0, duration: 0.9, delay: 0.4 });
  gsap.from('.slide.active .slide-sub', { y: 30, opacity: 0, duration: 0.7, delay: 0.6 });
  gsap.from('.slide.active .slide-price-badge', { scale: 0.8, opacity: 0, duration: 0.6, delay: 0.7 });
  gsap.from('.slide.active .slide-ctas', { y: 20, opacity: 0, duration: 0.6, delay: 0.9 });

  // Spec numbers counter
  ScrollTrigger.create({
    trigger: '.spec-bar',
    once: true,
    onEnter: () => animateSpecNumbers()
  });

  // Feature cards stagger
  gsap.from('.feature-card', {
    scrollTrigger: { trigger: '.features-grid', start: 'top 75%' },
    y: 50, opacity: 0, duration: 0.6, stagger: 0.08
  });

  // Product parallax
  gsap.to('.product-main-img', {
    scrollTrigger: { trigger: '.product-section', scrub: true },
    y: -30
  });
}

function animateSpecNumbers() {
  document.querySelectorAll('.spec-num').forEach(el => {
    gsap.from(el, { textContent: 0, duration: 1.5, ease: 'power2.out', snap: { textContent: 1 } });
  });
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const backTop = document.getElementById('backTop');
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
});

// ===== HERO SLIDER =====
let currentSlide = 0;
const totalSlides = 3;
let slideTimer;

function goSlide(n) {
  clearInterval(slideTimer);
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + totalSlides) % totalSlides;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  startAutoSlide();
}

function nextSlide() { goSlide(currentSlide + 1); }
function prevSlide() { goSlide(currentSlide - 1); }

function startAutoSlide() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => { goSlide(currentSlide + 1); }, 5000);
}

startAutoSlide();

// ===== PRODUCT THUMBNAILS =====
document.querySelectorAll('.thumb').forEach((thumb, i) => {
  thumb.addEventListener('click', () => {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    const mainImg = document.querySelector('.product-main-img');
    if (mainImg) mainImg.src = thumb.querySelector('img').src.replace('w=150', 'w=700');
  });
});

// ===== GALLERY LIGHTBOX =====
const galleryImages = [];
let currentLightbox = 0;

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  const img = item.querySelector('img');
  if (img) galleryImages.push({ src: img.src, alt: img.alt });

  item.addEventListener('click', () => {
    openLightbox(i);
  });
});

function openLightbox(i) {
  currentLightbox = i;
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  lbImg.src = galleryImages[i].src;
  lbImg.alt = galleryImages[i].alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxPrev() {
  currentLightbox = (currentLightbox - 1 + galleryImages.length) % galleryImages.length;
  const lbImg = document.getElementById('lightboxImg');
  lbImg.style.opacity = 0;
  setTimeout(() => {
    lbImg.src = galleryImages[currentLightbox].src;
    lbImg.style.opacity = 1;
  }, 200);
}

function lightboxNext() {
  currentLightbox = (currentLightbox + 1) % galleryImages.length;
  const lbImg = document.getElementById('lightboxImg');
  lbImg.style.opacity = 0;
  setTimeout(() => {
    lbImg.src = galleryImages[currentLightbox].src;
    lbImg.style.opacity = 1;
  }, 200);
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev();
  if (e.key === 'ArrowRight') lightboxNext();
});

// ===== FAQ ACCORDION =====
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-a');
  const isOpen = btn.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-q.open').forEach(b => {
    b.classList.remove('open');
    b.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
  });

  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
    // Smooth scroll into view
    setTimeout(() => btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  }
}

// ===== ORDER FORM STATE =====
const orderState = {
  name: '', phone: '', email: '',
  house: '', area: '', city: '', state: '', pin: '',
  payMethod: '',
  screenshotUploaded: false,
  finalAmount: 999
};

// ===== MULTI-STEP FORM =====
let currentStep = 1;

function goToStep(n) {
  // Allow going to done steps only
  if (n < currentStep) {
    showStep(n);
  }
}

function nextStep(from) {
  if (from === 1) {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    if (!name) { showFieldError('custName', 'Please enter your name'); return; }
    if (!phone || phone.length < 10) { showFieldError('custPhone', 'Please enter a valid phone number'); return; }
    orderState.name = name;
    orderState.phone = phone;
    orderState.email = document.getElementById('custEmail').value.trim();
    markStepDone(1);
    showStep(2);
  } else if (from === 2) {
    const house = document.getElementById('addrHouse').value.trim();
    const area = document.getElementById('addrArea').value.trim();
    const city = document.getElementById('addrCity').value.trim();
    const state = document.getElementById('addrState').value.trim();
    const pin = document.getElementById('addrPin').value.trim();
    if (!house) { showFieldError('addrHouse', 'Please enter house/flat number'); return; }
    if (!area) { showFieldError('addrArea', 'Please enter area/street'); return; }
    if (!city) { showFieldError('addrCity', 'Please enter city'); return; }
    if (!state) { showFieldError('addrState', 'Please enter state'); return; }
    if (!pin || pin.length !== 6) { showFieldError('addrPin', 'Please enter valid 6-digit pincode'); return; }
    orderState.house = house;
    orderState.area = area;
    orderState.city = city;
    orderState.state = state;
    orderState.pin = pin;
    markStepDone(2);
    showStep(3);
  }
}

function prevStep(from) {
  showStep(from - 1);
}

function showStep(n) {
  currentStep = n;
  document.querySelectorAll('.form-step').forEach(s => s.classList.add('hidden'));
  document.getElementById('formStep' + n).classList.remove('hidden');
  // Update step indicator
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active');
    if (i + 1 === n) s.classList.add('active');
  });
  // Scroll to form
  document.getElementById('order').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function markStepDone(n) {
  const stepBtn = document.getElementById('stepBtn' + n);
  if (stepBtn) {
    stepBtn.classList.remove('active');
    stepBtn.classList.add('done');
    stepBtn.querySelector('.step-num').innerHTML = '<i class="fas fa-check"></i>';
  }
}

function showFieldError(id, msg) {
  const input = document.getElementById(id);
  if (!input) return;
  input.style.borderColor = '#EF4444';
  input.focus();
  // Remove error on change
  input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
  // Show message
  let errEl = input.parentElement.querySelector('.err-msg');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.className = 'err-msg';
    errEl.style.cssText = 'color:#EF4444;font-size:0.78rem;margin-top:4px;';
    input.parentElement.appendChild(errEl);
  }
  errEl.textContent = msg;
  setTimeout(() => { errEl.textContent = ''; }, 3000);
}

// ===== PAYMENT SELECTION =====
function selectPayment(method) {
  orderState.payMethod = method;
  const upiBlock = document.getElementById('upiBlock');
  const prepaidRow = document.getElementById('prepaidRow');
  const prepaidBanner = document.getElementById('prepaidBanner');
  const orderTotal = document.getElementById('orderTotal');
  const finalPriceBtn = document.getElementById('finalPriceBtn');
  const upiAmountDisplay = document.getElementById('upiAmountDisplay');

  if (method === 'upi') {
    upiBlock.classList.remove('hidden');
    prepaidRow.style.display = 'flex';
    prepaidBanner.style.display = 'block';
    orderState.finalAmount = 949;
    orderTotal.textContent = '₹949';
    finalPriceBtn.textContent = '949';
    upiAmountDisplay.textContent = '₹949';
    updateUPILink(949);
  } else {
    upiBlock.classList.add('hidden');
    prepaidRow.style.display = 'none';
    prepaidBanner.style.display = 'none';
    orderState.finalAmount = 999;
    orderTotal.textContent = '₹999';
    finalPriceBtn.textContent = '999';
    orderState.screenshotUploaded = false;
  }
}

function updateUPILink(amount) {
  const upiId = '8504843164-2@ybl';
  const merchant = encodeURIComponent('Ravi Mehar');
  const link = `upi://pay?pa=${upiId}&pn=${merchant}&am=${amount}&cu=INR`;
  document.getElementById('upiDeepLink').href = link;
}

function openUPI(e) {
  e.preventDefault();
  const amount = orderState.finalAmount;
  const upiId = '8504843164-2@ybl';
  const merchant = encodeURIComponent('Ravi Mehar');
  const upiLink = `upi://pay?pa=${upiId}&pn=${merchant}&am=${amount}&cu=INR`;
  window.location.href = upiLink;

  // After 3 seconds, show "payment done?" prompt
  setTimeout(() => {
    const msg = document.getElementById('payConfirmMsg');
    if (msg) { msg.classList.remove('hidden'); }
  }, 3000);
}

function copyUPI() {
  navigator.clipboard.writeText('8504843164-2@ybl').then(() => {
    const btn = document.querySelector('.copy-btn');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.style.background = 'var(--green)';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-copy"></i>';
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    }
  }).catch(() => {
    alert('UPI ID: 8504843164-2@ybl');
  });
}

// ===== SCREENSHOT UPLOAD =====
function screenshotSelected(input) {
  const preview = document.getElementById('screenshotPreview');
  const uploadText = document.getElementById('uploadText');
  const payConfirmMsg = document.getElementById('payConfirmMsg');
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.innerHTML = `<img src="${e.target.result}" alt="Payment Screenshot" style="max-width:200px;border-radius:10px;margin:0 auto;" />`;
      preview.classList.remove('hidden');
      uploadText.textContent = '✅ Screenshot uploaded!';
      payConfirmMsg.classList.remove('hidden');
      orderState.screenshotUploaded = true;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ===== CONFIRM ORDER =====
function confirmOrder() {
  if (!orderState.payMethod) {
    alert('Please select a payment method to continue.');
    return;
  }
  if (orderState.payMethod === 'upi' && !orderState.screenshotUploaded) {
    const confirmMsg = document.getElementById('payConfirmMsg');
    if (!confirmMsg.classList.contains('hidden')) {
      // Allow proceed – screenshot confirmed
    } else {
      const go = confirm('Have you completed the UPI payment? Click OK to confirm order, or Cancel to upload screenshot first.');
      if (!go) return;
    }
  }

  const orderId = 'OP' + Date.now().toString().slice(-8);
  const orderTime = new Date().toLocaleString('en-IN');

  // Build receipt HTML
  const receipt = `
    <div style="font-weight:700;font-size:1rem;margin-bottom:8px;color:var(--dark)">Order #${orderId}</div>
    <div><b>Product:</b> OnePlus Z2 ANC Neckband (Black)</div>
    <div><b>Qty:</b> 1</div>
    <div><b>Name:</b> ${orderState.name}</div>
    <div><b>Phone:</b> ${orderState.phone}</div>
    <div><b>Address:</b> ${orderState.house}, ${orderState.area}, ${orderState.city}, ${orderState.state} – ${orderState.pin}</div>
    <div><b>Payment:</b> ${orderState.payMethod === 'upi' ? 'Prepaid (UPI)' : 'Cash on Delivery'}</div>
    ${orderState.payMethod === 'upi' ? '<div><b>Discount Applied:</b> -₹50 (Prepaid)</div>' : ''}
    <div style="font-weight:700;color:var(--dark);margin-top:8px"><b>Final Amount:</b> ₹${orderState.finalAmount}</div>
    <div><b>Order Time:</b> ${orderTime}</div>
  `;

  document.getElementById('orderReceipt').innerHTML = receipt;

  // WhatsApp link
  const waMsg = encodeURIComponent(
    `🛒 *New Order Confirmed!*\n` +
    `Order ID: ${orderId}\n` +
    `Product: OnePlus Z2 ANC Neckband\n` +
    `Name: ${orderState.name}\n` +
    `Phone: ${orderState.phone}\n` +
    `Address: ${orderState.house}, ${orderState.area}, ${orderState.city}, ${orderState.state} – ${orderState.pin}\n` +
    `Payment: ${orderState.payMethod === 'upi' ? 'Prepaid UPI' : 'COD'}\n` +
    `Amount: ₹${orderState.finalAmount}\n` +
    `Time: ${orderTime}`
  );
  document.getElementById('waConfirmLink').href = `https://wa.me/918504843164?text=${waMsg}`;

  // Save to localStorage for admin
  saveOrderToAdmin({
    id: orderId, name: orderState.name, phone: orderState.phone,
    email: orderState.email, city: orderState.city, state: orderState.state,
    pin: orderState.pin, payment: orderState.payMethod,
    amount: orderState.finalAmount, time: orderTime
  });

  // Show success
  document.querySelector('.order-wrap').classList.add('hidden');
  document.getElementById('orderSuccess').classList.remove('hidden');
  document.getElementById('orderSuccess').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Trigger confetti-like GSAP
  if (typeof gsap !== 'undefined') {
    gsap.from('#orderSuccess .success-wrap', { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.4)' });
  }
}

// ===== ADMIN PANEL =====
function saveOrderToAdmin(order) {
  try {
    const orders = JSON.parse(localStorage.getItem('z2_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('z2_orders', JSON.stringify(orders));
  } catch (e) { /* localStorage unavailable */ }
}

let adminClickCount = 0;
let adminTimer;

document.querySelector('.nav-logo')?.addEventListener('click', () => {
  adminClickCount++;
  clearTimeout(adminTimer);
  adminTimer = setTimeout(() => { adminClickCount = 0; }, 2000);
  if (adminClickCount >= 5) {
    adminClickCount = 0;
    const pass = prompt('Admin Password:');
    if (pass === 'admin123') showAdminPanel();
  }
});

function checkAdmin() {
  const pass = prompt('Admin Password:');
  if (pass === 'admin123') showAdminPanel();
}

function showAdminPanel() {
  const panel = document.getElementById('adminPanel');
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth' });
  loadAdminOrders();
}

function loadAdminOrders() {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('z2_orders') || '[]'); } catch (e) {}

  // Stats
  const totalRevenue = orders.filter(o => o.payment === 'upi').reduce((sum, o) => sum + Number(o.amount), 0);
  const codOrders = orders.filter(o => o.payment === 'cod').length;
  const upiOrders = orders.filter(o => o.payment === 'upi').length;

  document.getElementById('adminStats').innerHTML = `
    <div class="admin-stat-card"><div class="stat-num">${orders.length}</div><div class="stat-label">Total Orders</div></div>
    <div class="admin-stat-card"><div class="stat-num">${upiOrders}</div><div class="stat-label">Prepaid</div></div>
    <div class="admin-stat-card"><div class="stat-num">${codOrders}</div><div class="stat-label">COD</div></div>
    <div class="admin-stat-card"><div class="stat-num">₹${totalRevenue.toLocaleString()}</div><div class="stat-label">Prepaid Revenue</div></div>
  `;

  const tbody = document.getElementById('ordersBody');
  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#888;padding:32px">No orders yet</td></tr>';
    return;
  }
  tbody.innerHTML = orders.map((o, i) => `
    <tr>
      <td>#${i + 1}</td>
      <td>${o.name}</td>
      <td>${o.phone}</td>
      <td>${o.city}</td>
      <td>${o.state}</td>
      <td><span style="padding:3px 10px;border-radius:10px;font-size:0.75rem;font-weight:600;background:${o.payment === 'upi' ? '#E8F5E9' : '#FFF9C4'};color:${o.payment === 'upi' ? '#2E7D32' : '#92400E'}">${o.payment === 'upi' ? 'Prepaid' : 'COD'}</span></td>
      <td style="font-weight:700">₹${o.amount}</td>
      <td>${o.time}</td>
    </tr>
  `).join('');
}

function exportOrders() {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('z2_orders') || '[]'); } catch (e) {}
  if (!orders.length) { alert('No orders to export'); return; }

  const headers = ['#', 'Order ID', 'Name', 'Phone', 'Email', 'City', 'State', 'Pin', 'Payment', 'Amount', 'Time'];
  const rows = orders.map((o, i) => [i+1, o.id, o.name, o.phone, o.email, o.city, o.state, o.pin, o.payment, o.amount, `"${o.time}"`]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');

  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'oneplusz2_orders_' + Date.now() + '.csv';
  a.click();
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== PARALLAX FOR HERO =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.slide-img').forEach(img => {
    img.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
  });
});

// ===== BACK TO TOP VISIBILITY =====
window.addEventListener('scroll', () => {
  const backTop = document.getElementById('backTop');
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
});

// ===== TOUCH SLIDER SUPPORT =====
let touchStartX = 0;
document.querySelector('.hero')?.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
document.querySelector('.hero')?.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? nextSlide() : prevSlide();
  }
});

console.log('%c OnePlus Z2 ANC – Premium E-Commerce Website', 'font-family:serif;font-size:16px;color:#F8A4C8;background:#111;padding:8px 16px;border-radius:4px;');
console.log('%c Built with ❤️ in India', 'font-size:12px;color:#888;');
