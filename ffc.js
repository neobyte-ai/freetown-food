/* ===== Freetown Food Corner - Interactive Scripts ===== */

document.addEventListener('DOMContentLoaded', () => {
  // ----- Navbar scroll effect -----
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

  // ----- Mobile menu toggle -----
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click (for mobile)
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('active') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ----- Active nav link on scroll -----
  const sections = document.querySelectorAll('section[id], header[id]');

  function highlightNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ----- Menu category filter -----
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuCards = document.querySelectorAll('.menu-card');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;

      menuCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ----- Smooth reveal on scroll (Intersection Observer) -----
  const revealElements = document.querySelectorAll(
    '.menu-card, .info-card, .gallery-item, .about-content, .about-image, .stat'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => {
    el.classList.add('reveal-ready');
    revealObserver.observe(el);
  });

  // Add reveal styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .reveal-ready {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .reveal-ready.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    .menu-card.reveal-ready { transition-delay: 0.05s; }
    .gallery-item.reveal-ready { transition-delay: 0.08s; }
    .info-card.reveal-ready { transition-delay: 0.06s; }
  `;
  document.head.appendChild(style);

  // Stagger delays for grid items
  document.querySelectorAll('.menu-grid .menu-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.06}s`;
  });

  document.querySelectorAll('.gallery-grid .gallery-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.07}s`;
  });

  // ----- Simple lightbox for gallery (optional enhancement) -----
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-content">
          <img src="${img.src.replace('w=600', 'w=1200').replace('w=800', 'w=1200')}" alt="${img.alt}">
          <button class="lightbox-close" aria-label="Close">&times;</button>
        </div>
      `;
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      // Force reflow then show
      requestAnimationFrame(() => {
        lightbox.classList.add('active');
      });

      const close = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
          lightbox.remove();
          document.body.style.overflow = '';
        }, 300);
      };

      lightbox.querySelector('.lightbox-backdrop').addEventListener('click', close);
      lightbox.querySelector('.lightbox-close').addEventListener('click', close);
      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
          close();
          document.removeEventListener('keydown', escHandler);
        }
      });
    });
  });

  // Lightbox styles
  const lightboxStyle = document.createElement('style');
  lightboxStyle.textContent = `
    .lightbox {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .lightbox.active {
      opacity: 1;
    }
    .lightbox-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(10, 20, 15, 0.92);
      cursor: pointer;
    }
    .lightbox-content {
      position: relative;
      max-width: 90vw;
      max-height: 85vh;
      z-index: 1;
    }
    .lightbox-content img {
      max-width: 100%;
      max-height: 85vh;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 2.2rem;
      cursor: pointer;
      line-height: 1;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    .lightbox-close:hover {
      opacity: 1;
    }
  `;
  document.head.appendChild(lightboxStyle);
});
