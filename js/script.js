// ============================================
// LOCKY BARBER — Script principal
// ============================================

// ---------- NAVBAR SCROLL ----------
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ---------- MENÚ MÓVIL CON ANIMACIÓN ----------
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  burger.classList.toggle("active");
  document.body.style.overflow = navLinks.classList.contains("open")
    ? "hidden"
    : "";
});

// Cerrar menú al hacer clic en un enlace
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// Cerrar menú al hacer clic fuera
document.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
    navLinks.classList.remove("open");
    burger.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Cerrar menú con tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
    burger.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// ---------- SMOOTH SCROLL CON OFFSET ----------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // altura del navbar
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

// ---------- SWIPER GALERÍA ----------
new Swiper(".gallery-swiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: { delay: 4000, disableOnInteraction: false },
  pagination: { el: ".swiper-pagination", clickable: true },
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

// ---------- REVEAL ON SCROLL ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ---------- VALIDACIÓN DEL FORMULARIO ----------
const bookingForm = document.getElementById("bookingForm");
const formSubmit = document.getElementById("formSubmit");

function validateField(field) {
  const group = field.closest(".form-group");
  if (!group) return true;

  let valid = true;
  const type = field.type || field.tagName.toLowerCase();

  if (field.required && !field.value.trim()) {
    valid = false;
  } else if (type === "email" && field.value.trim()) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    valid = re.test(field.value.trim());
  } else if (type === "tel" && field.value.trim()) {
    const re = /^[\d\s\-\+\(\)]{7,20}$/;
    valid = re.test(field.value.trim());
  } else if (field.tagName.toLowerCase() === "select" && !field.value) {
    valid = false;
  }

  group.classList.toggle("error", !valid);
  return valid;
}

// Validar en tiempo real
bookingForm.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.closest(".form-group")?.classList.contains("error")) {
      validateField(field);
    }
  });
});

// ---------- FORMULARIO DE RESERVA ----------
bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validar todos los campos
  const fields = bookingForm.querySelectorAll(
    "input[required], select[required]",
  );
  let allValid = true;
  fields.forEach((f) => {
    if (!validateField(f)) allValid = false;
  });

  if (!allValid) {
    // Scroll al primer error
    const firstError = bookingForm.querySelector(".form-group.error");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  // Mostrar loading
  const btnText = formSubmit.querySelector(".btn-text");
  const btnLoading = formSubmit.querySelector(".btn-loading");
  btnText.style.display = "none";
  btnLoading.style.display = "inline";
  formSubmit.disabled = true;

  // Simular envío (2000ms)
  setTimeout(() => {
    const data = new FormData(bookingForm);
    const nombre = data.get("nombre");
    const servicio = data.get("servicio");
    const fecha = data.get("fecha");
    const hora = data.get("hora");

    // Formatear fecha a español
    const fechaObj = new Date(fecha + "T12:00:00");
    const fechaFormateada = fechaObj.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Restaurar botón
    btnText.style.display = "inline";
    btnLoading.style.display = "none";
    formSubmit.disabled = false;

    showModal(nombre, servicio, fechaFormateada, hora);
    bookingForm.reset();

    // Limpiar errores
    bookingForm
      .querySelectorAll(".form-group")
      .forEach((g) => g.classList.remove("error"));
  }, 2000);
});

// ---------- MODAL DE CONFIRMACIÓN ----------
function showModal(nombre, servicio, fecha, hora) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-icon">✓</div>
    <h2 class="modal-title">¡RESERVA CONFIRMADA!</h2>
    <p class="modal-subtitle">Gracias, <strong>${nombre}</strong>. Hemos recibido tu solicitud.</p>
    <div class="modal-details">
      <div class="modal-detail">
        <span class="modal-detail-label">Servicio</span>
        <span class="modal-detail-value">${servicio}</span>
      </div>
      <div class="modal-detail">
        <span class="modal-detail-label">Fecha</span>
        <span class="modal-detail-value">${fecha}</span>
      </div>
      <div class="modal-detail">
        <span class="modal-detail-label">Hora</span>
        <span class="modal-detail-value">${hora}</span>
      </div>
    </div>
    <p class="modal-message">Te confirmaremos por email y SMS en los próximos minutos.</p>
    <button class="modal-btn">Entendido</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Animación de entrada
  requestAnimationFrame(() => {
    overlay.classList.add("active");
    modal.classList.add("active");
  });

  // Cerrar modal
  const closeModal = () => {
    overlay.classList.remove("active");
    modal.classList.remove("active");
    setTimeout(() => overlay.remove(), 400);
  };

  modal.querySelector(".modal-btn").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // Cerrar con Escape
  const escHandler = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);
}

// ---------- FECHA MÍNIMA (sin desfase horario) ----------
const fechaInput = document.querySelector('input[name="fecha"]');
if (fechaInput) {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  fechaInput.min = `${yyyy}-${mm}-${dd}`;
}
