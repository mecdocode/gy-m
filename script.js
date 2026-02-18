/* ===========================
   MUSCLE WARRIOR GYM — JS
   =========================== */

// ---- NAVBAR: scroll effect + active link ----
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link based on scroll position
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
  document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- INTERSECTION OBSERVER: scroll animations ----
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children if it's a grid parent
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animated elements
const animatedEls = document.querySelectorAll('[data-aos], .service-card, .testimonial-card, .pricing-card, .gallery-item, .about-content, .contact-info, .map-container');

animatedEls.forEach((el, index) => {
  // Add stagger delay for grid items
  const parent = el.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children).filter(c => c.classList.contains(el.classList[0]));
    const siblingIndex = siblings.indexOf(el);
    if (siblingIndex > 0) {
      el.dataset.delay = siblingIndex * 100;
    }
  }
  observer.observe(el);
});

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- STICKY WHATSAPP: hide when footer visible ----
const stickyWA = document.getElementById('stickyWhatsapp');
const footer = document.querySelector('.footer');

if (stickyWA && footer) {
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      stickyWA.style.opacity = entry.isIntersecting ? '0' : '1';
      stickyWA.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0.1 });
  footerObserver.observe(footer);
}

// ---- GALLERY LIGHTBOX (simple) ----
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.95);
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-out; animation: fadeInUp 0.2s ease;
      padding: 1rem;
    `;

    const imgEl = document.createElement('img');
    imgEl.src = img.src.replace(/w=\d+/, 'w=1200');
    imgEl.style.cssText = `
      max-width: 90vw; max-height: 90vh;
      object-fit: contain; border-radius: 8px;
      box-shadow: 0 20px 80px rgba(0,0,0,0.8);
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: absolute; top: 1.5rem; right: 1.5rem;
      background: rgba(255,255,255,0.1); border: none;
      color: #fff; font-size: 1.5rem; width: 44px; height: 44px;
      border-radius: 50%; cursor: pointer; display: flex;
      align-items: center; justify-content: center;
      transition: background 0.2s;
    `;
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = 'rgba(200,255,0,0.2)');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = 'rgba(255,255,255,0.1)');

    overlay.appendChild(imgEl);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      overlay.remove();
      document.body.style.overflow = '';
    };

    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }, { once: true });
  });
});

// ---- COUNTER ANIMATION for stats ----
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1500;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

// Observe hero stats
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stats are already rendered as text, just add visible class
        heroStats.style.opacity = '1';
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

// ---- PRICING CARD: highlight on hover ----
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    document.querySelectorAll('.pricing-card').forEach(c => {
      if (c !== card) c.style.opacity = '0.6';
    });
  });
  card.addEventListener('mouseleave', () => {
    document.querySelectorAll('.pricing-card').forEach(c => {
      c.style.opacity = '1';
    });
  });
});

// ---- TICKER: pause on hover ----
const ticker = document.querySelector('.ticker');
if (ticker) {
  ticker.addEventListener('mouseenter', () => {
    ticker.style.animationPlayState = 'paused';
  });
  ticker.addEventListener('mouseleave', () => {
    ticker.style.animationPlayState = 'running';
  });
}

console.log('%c⚔ MUSCLE WARRIOR GYM ⚔', 'color: #c8ff00; font-size: 20px; font-weight: bold; background: #0a0a0a; padding: 8px 16px;');
console.log('%cForge Your Legacy — Balawala, Dehradun', 'color: #888; font-size: 12px;');
