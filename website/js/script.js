// =============================================
//  ZAFRAN — Royal Mughlai Restaurant
//  script.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Loading Screen ---- */
  const loader = document.getElementById('loading-screen');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 900);
    });
    document.body.style.overflow = 'hidden';
  }

  /* ---- Navbar scroll behaviour ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Active nav link ---- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- Mobile menu ---- */
  const hamburger    = document.querySelector('.hamburger');
  const mobileMenu   = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function openMenu() {
    hamburger?.classList.add('open');
    mobileMenu?.classList.add('open');
    mobileOverlay?.classList.add('open');
    mobileOverlay.style.display = 'block';
  }
  function closeMenu() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    setTimeout(() => { if (mobileOverlay) mobileOverlay.style.display = ''; }, 400);
  }

  hamburger?.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });
  mobileOverlay?.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---- Hero parallax ---- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `scale(1.05) translateY(${y * 0.25}px)`;
    }, { passive: true });
  }

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- Counter animation ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObs.observe(el));
  }

  /* ---- Menu tabs (home featured) ---- */
  const menuTabs  = document.querySelectorAll('.menu-tab');
  const dishPanels = document.querySelectorAll('.dishes-panel');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      dishPanels.forEach(p => {
        p.style.display = p.dataset.panel === target ? 'grid' : 'none';
      });
    });
  });

  /* ---- Menu category filter ---- */
  const catBtns = document.querySelectorAll('.cat-btn');
  const menuSections = document.querySelectorAll('.menu-section[data-category]');

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      menuSections.forEach(sec => {
        if (cat === 'all' || sec.dataset.category === cat) {
          sec.style.display = '';
          sec.style.animation = 'fadeIn .4s ease';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });

  /* ---- Gallery filter ---- */
  const galleryBtns = document.querySelectorAll('.gallery-filter .cat-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

  galleryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      galleryItems.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.opacity = show ? '1' : '0';
        item.style.pointerEvents = show ? '' : 'none';
        item.style.transform = show ? '' : 'scale(0.9)';
        item.style.transition = 'opacity .3s, transform .3s';
      });
    });
  });

  /* ---- Lightbox ---- */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentGalleryIdx = 0;
  let galleryImgs = [];

  if (lightbox) {
    galleryImgs = Array.from(document.querySelectorAll('.gallery-item img'));

    document.querySelectorAll('.gallery-item').forEach((item, idx) => {
      item.addEventListener('click', () => {
        currentGalleryIdx = idx;
        lightboxImg.src = galleryImgs[idx].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    lightboxPrev?.addEventListener('click', () => {
      currentGalleryIdx = (currentGalleryIdx - 1 + galleryImgs.length) % galleryImgs.length;
      lightboxImg.src = galleryImgs[currentGalleryIdx].src;
    });
    lightboxNext?.addEventListener('click', () => {
      currentGalleryIdx = (currentGalleryIdx + 1) % galleryImgs.length;
      lightboxImg.src = galleryImgs[currentGalleryIdx].src;
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')  lightboxPrev?.click();
      if (e.key === 'ArrowRight') lightboxNext?.click();
    });
  }

  /* ---- Reservation form validation ---- */
  const resForm = document.getElementById('reservation-form');
  if (resForm) {
    resForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      resForm.querySelectorAll('[required]').forEach(field => {
        const errEl = field.parentElement.querySelector('.form-error');
        if (!field.value.trim()) {
          field.classList.add('error');
          if (errEl) errEl.textContent = 'This field is required.';
          valid = false;
        } else {
          field.classList.remove('error');
          if (errEl) errEl.textContent = '';
        }
      });

      const phone = resForm.querySelector('#res-phone');
      if (phone && phone.value && !/^[\+]?[\d\s\-\(\)]{8,15}$/.test(phone.value.trim())) {
        phone.classList.add('error');
        const errEl = phone.parentElement.querySelector('.form-error');
        if (errEl) errEl.textContent = 'Please enter a valid phone number.';
        valid = false;
      }

      if (valid) {
        resForm.style.display = 'none';
        const successEl = document.getElementById('form-success');
        if (successEl) successEl.classList.add('show');
      }
    });

    resForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const errEl = field.parentElement.querySelector('.form-error');
        if (errEl) errEl.textContent = '';
      });
    });
  }

  /* ---- Set min date for reservation ---- */
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm   = String(today.getMonth() + 1).padStart(2, '0');
    const dd   = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- Page-specific hero bg images ---- */
  const pageHeroBgs = {
    'menu.html':    'https://images.unsplash.com/photo-1567337710282-00832b415979?w=1600&q=80',
    'about.html':   'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80',
    'gallery.html': 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=1600&q=80',
    'contact.html': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
  };
  const heroBgEl = document.querySelector('.page-hero-bg');
  if (heroBgEl && pageHeroBgs[currentPage]) {
    heroBgEl.style.backgroundImage = `url('${pageHeroBgs[currentPage]}')`;
  }

  /* ---- Toast notification ---- */
  window.showToast = function(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    toast.style.cssText = `
      position:fixed; bottom:80px; right:32px; z-index:9999;
      background:${type === 'success' ? '#2D7A3A' : '#8B0000'};
      color:#fff; padding:14px 24px; border-radius:8px;
      font-family:'Lora',serif; font-size:.9rem;
      box-shadow:0 8px 24px rgba(0,0,0,.25);
      animation: toastSlide .4s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  };

  console.log('%cZAFRAN — Royal Mughlai Experience', 'color:#D4AF37;font-size:1.2rem;font-weight:bold;');

}); // end DOMContentLoaded
