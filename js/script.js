// ============================================
// LOCKY BARBER — Script principal
// ============================================

// ---------- NAVBAR SCROLL ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ---------- MENÚ MÓVIL ----------
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Cerrar menú al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.textContent = '☰';
  });
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
    navLinks.classList.remove('open');
    burger.textContent = '☰';
  }
});

// ---------- SWIPER GALERÍA ----------
new Swiper('.gallery-swiper', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: { delay: 4000, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});

// ---------- REVEAL ON SCROLL ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---------- FORMULARIO DE RESERVA ----------
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(bookingForm);
  const nombre = data.get('nombre');
  alert(`¡Gracias ${nombre}! 🎉\n\nHemos recibido tu reserva. Te confirmaremos por email y SMS en los próximos minutos.\n\n— Equipo Locky Barber`);
  bookingForm.reset();
});

// ---------- FECHA MÍNIMA (sin desfase horario) ----------
const fechaInput = document.querySelector('input[name="fecha"]');
if (fechaInput) {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  fechaInput.min = `${yyyy}-${mm}-${dd}`;
}