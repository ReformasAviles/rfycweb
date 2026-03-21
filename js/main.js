  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function setMobileMenuState(open) {
    mobileMenu.classList.toggle('hidden', !open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
  }

  menuToggle.addEventListener('click', () => {
    setMobileMenuState(mobileMenu.classList.contains('hidden'));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMobileMenuState(false);
    });
  });

  // Hide header when not in top 10% of page
  const header = document.querySelector('header');
  header.style.transition = 'transform 0.3s ease';

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const top10Percent = 0.1 * totalHeight;

    if (scrollTop < top10Percent) {
      header.style.transform = 'translateY(0)';
    } else {
      header.style.transform = 'translateY(-100%)';
    }
  });

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top');
  console.log('backToTopBtn:', backToTopBtn);
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 300) {
        backToTopBtn.style.opacity = '1';
      } else {
        backToTopBtn.style.opacity = '0';
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const carouselImages = [
    { src: 'img/portada.jpg', alt: 'Arquitectura moderna' },
    { src: 'img/obra1.jpg', alt: 'Proyecto residencial' },
    { src: 'img/obra2.jpg', alt: 'Diseño sostenible' },
    { src: 'img/obra3.jpg', alt: 'Interior contemporáneo' },
    { src: 'img/obra4.jpg', alt: 'Fachada elegante' },
    { src: 'img/obra5.jpg', alt: 'Espacio luminoso' }
  ];

  const carousel = document.getElementById('carousel');
  const carouselImage = document.getElementById('carousel-image');
  carouselImage.style.transition = 'opacity 0.6s ease';
  const carouselCaption = document.getElementById('carousel-caption');
  const carouselIndicators = document.getElementById('carousel-indicators');
  const prevButton = document.getElementById('carousel-prev');
  const nextButton = document.getElementById('carousel-next');

  let carouselIndex = 0;
  let carouselTimer = null;
  let initialLoad = true;

  // Swipe support (móvil)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const SWIPE_THRESHOLD = 50; // px

  carousel.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchEndX = touchStartX;
    touchEndY = touchStartY;
  });

  carousel.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
  });

  carousel.addEventListener('touchend', () => {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // Solo swipe horizontal (ignora scroll vertical)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetTimer();
    }
  });

  function renderIndicators() {
    carouselIndicators.innerHTML = '';
    carouselImages.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'w-3 h-3 rounded-full bg-white/50 hover:bg-white transition';
      dot.setAttribute('aria-label', `Ir a imagen ${idx + 1}`);
      if (idx === carouselIndex) dot.classList.replace('bg-white/50', 'bg-white');
      dot.addEventListener('click', () => {
        carouselIndex = idx;
        updateSlide();
        resetTimer();
      });
      carouselIndicators.appendChild(dot);
    });
  }

  function updateSlide() {
    const current = carouselImages[carouselIndex];

    if (initialLoad) {
      initialLoad = false;
      carouselImage.src = current.src;
      carouselImage.alt = current.alt;
      carouselImage.srcset = current.src + ' 1x';
      carouselImage.style.opacity = '1';
    } else {
      // Fade out
      carouselImage.style.opacity = '0';

      setTimeout(() => {
        carouselImage.src = current.src;
        carouselImage.alt = current.alt;
        carouselImage.srcset = current.src + ' 1x';

        // Fade in
        carouselImage.style.opacity = '1';
      }, 300);
    }

    Array.from(carouselIndicators.children).forEach((dot, idx) => {
      if (idx === carouselIndex) {
        dot.classList.remove('bg-white/50');
        dot.classList.add('bg-white');
      } else {
        dot.classList.remove('bg-white');
        dot.classList.add('bg-white/50');
      }
    });
  }

  function nextSlide() {
    carouselIndex = (carouselIndex + 1) % carouselImages.length;
    updateSlide();
  }

  function prevSlide() {
    carouselIndex = (carouselIndex - 1 + carouselImages.length) % carouselImages.length;
    updateSlide();
  }

  function resetTimer() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(nextSlide, 5000);
  }

  prevButton.addEventListener('click', () => {
    prevSlide();
    resetTimer();
  });

  nextButton.addEventListener('click', () => {
    nextSlide();
    resetTimer();
  });

  renderIndicators();
  updateSlide();
  resetTimer();

  // Scroll suave de 1 segundo en enlaces internos (#)
  const links = document.querySelectorAll('a[href^="#"]');
  console.log('Found', links.length, 'anchor links');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || !href.startsWith('#')) return;
      
      e.preventDefault();
      console.log('Smooth scroll triggered for', href);
      const target = document.querySelector(href);
      if (!target) return;

      const start = window.scrollY;
      const end = target.offsetTop - 100; // Margen de 100px desde arriba
      const duration = 1000; // 1 segundo
      const startTime = performance.now();

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing ease-in-out para suavidad
        const easeProgress = progress < 0.5 
          ? 2 * progress * progress 
          : -1 + (4 - 2 * progress) * progress;
        
        window.scrollTo(0, start + (end - start) * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    });
  });

