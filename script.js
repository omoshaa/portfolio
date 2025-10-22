// Navegação Mobile
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger?.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");

  // Animar as barras do hamburger
  const bars = hamburger.querySelectorAll(".bar");
  if (hamburger.classList.contains("active")) {
    bars[0].style.transform = "rotate(45deg) translateY(7px)";
    bars[1].style.opacity = "0";
    bars[2].style.transform = "rotate(-45deg) translateY(-7px)";
  } else {
    bars.forEach((bar) => {
      bar.style.transform = "none";
      bar.style.opacity = "1";
    });
  }
});

// Fechar menu ao clicar nos links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger?.classList.remove("active");
    navMenu?.classList.remove("active");

    const bars = hamburger?.querySelectorAll(".bar");
    bars?.forEach((bar) => {
      bar.style.transform = "none";
      bar.style.opacity = "1";
    });
  });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Header background no scroll
let lastScroll = 0;
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// Active navigation link
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Intersection Observer para animações suaves
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      entry.target.style.animation = "fadeInUp 0.6s ease forwards";
    }
  });
}, observerOptions);

// Observar skill cards e project cards
document.addEventListener("DOMContentLoaded", () => {
  const skillCards = document.querySelectorAll(".skill-card");
  const projectCards = document.querySelectorAll(".project-card");

  skillCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.05}s`;
    fadeInObserver.observe(card);
  });

  projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    fadeInObserver.observe(card);
  });
});

// Efeito de digitação no título hero (opcional, sutil)
function typeWriterEffect() {
  const heroTitle = document.querySelector(".hero-text h1");
  if (!heroTitle) return;

  const text = heroTitle.innerHTML;
  heroTitle.innerHTML = "";
  heroTitle.style.opacity = "1";

  let i = 0;
  const speed = 30;

  function type() {
    if (i < text.length) {
      heroTitle.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  // Descomentar se quiser o efeito de digitação
  // setTimeout(type, 500);
}

// Parallax sutil na imagem do perfil
const profileImage = document.querySelector(".image-container");

window.addEventListener("mousemove", (e) => {
  if (window.innerWidth > 1024 && profileImage) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const moveX = (mouseX - 0.5) * 20;
    const moveY = (mouseY - 0.5) * 20;

    profileImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }
});

// Form handling
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Validação básica
    if (!name || !email || !message) {
      showNotification("Por favor, preencha todos os campos.", "error");
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification("Por favor, insira um email válido.", "error");
      return;
    }

    const submitBtn = this.querySelector(".btn-primary");
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    // EmailJS integration
    if (typeof emailjs !== "undefined") {
      emailjs.init("z5br6UWIco45I3dGF");

      emailjs
        .send("service_j65yx6b", "template_1kfmkrf", {
          from_name: name,
          from_email: email,
          message: message,
          to_email: "moiseisfelipi@gmail.com",
        })
        .then(
          function (response) {
            showNotification("✓ Mensagem enviada com sucesso!", "success");
            contactForm.reset();
          },
          function (error) {
            showNotification("Erro ao enviar. Tente novamente.", "error");
          }
        )
        .finally(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    } else {
      // Fallback se EmailJS não estiver disponível
      setTimeout(() => {
        showNotification("✓ Mensagem enviada com sucesso!", "success");
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    }
  });
}

// Sistema de notificações minimalista
function showNotification(message, type) {
  // Remover notificações existentes
  const existing = document.querySelectorAll(".notification");
  existing.forEach((notif) => notif.remove());

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  notification.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        background: ${
          type === "success"
            ? "rgba(0, 212, 255, 0.1)"
            : "rgba(239, 68, 68, 0.1)"
        };
        color: ${type === "success" ? "#00d4ff" : "#ef4444"};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        border: 1px solid ${
          type === "success"
            ? "rgba(0, 212, 255, 0.3)"
            : "rgba(239, 68, 68, 0.3)"
        };
        z-index: 10000;
        font-size: 0.95rem;
        font-weight: 500;
        backdrop-filter: blur(20px);
        animation: slideIn 0.3s ease;
        box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.3);
        max-width: 320px;
    `;

  document.body.appendChild(notification);

  // Remover após 4 segundos
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Adicionar estilos de animação de notificação
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Cursor trail effect (sutil)
let cursorTrail = [];
const trailLength = 10;

document.addEventListener("mousemove", (e) => {
  if (window.innerWidth > 1024) {
    cursorTrail.push({ x: e.clientX, y: e.clientY });

    if (cursorTrail.length > trailLength) {
      cursorTrail.shift();
    }
  }
});

// Loading inicial
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// Prevenção de click duplo em botões
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (this.classList.contains("processing")) {
      return false;
    }
    this.classList.add("processing");
    setTimeout(() => this.classList.remove("processing"), 2000);
  });
});

console.log(
  "%c🚀 Portfolio carregado com sucesso!",
  "color: #00d4ff; font-size: 16px; font-weight: bold;"
);
console.log(
  "%cDesenvolvido por Moisés Filipe",
  "color: #7b68ee; font-size: 12px;"
);
