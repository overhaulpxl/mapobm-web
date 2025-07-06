document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".loading").style.display = "block";

    window.addEventListener("load", function() {
        document.querySelector(".loading").style.display = "none";
    });

    const menuBar = document.querySelector('.menu-bar');
    const menu = document.querySelector('.menu');

    menuBar.addEventListener('click', () => {
        menu.classList.toggle('active');
        document.body.classList.toggle('menu-open', menu.classList.contains('active'));
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && !menu.contains(e.target) && !menuBar.contains(e.target)) {
            menu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                menu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    const navBar = document.querySelector(".navbar");

    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    const scrollHandler = debounce(() => {
        const windowPosition = window.scrollY > 0;
        navBar.classList.toggle("scrolling-active", windowPosition);
        if (windowPosition) {
            menu.classList.remove("menu-active");
        }

        document.querySelectorAll('.fade-in').forEach(element => {
            const rect = element.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom >= 0;
            if (inView) {
                element.classList.add('visible');
            } else {
                element.classList.remove('visible');
            }
        });

        const scrollTopButton = document.querySelector(".scroll-top");
        if (window.scrollY > 300) {
            scrollTopButton.style.display = "flex";
        } else {
            scrollTopButton.style.display = "none";
        }
    });

    window.addEventListener("scroll", scrollHandler);

    function scrollToSection(id) {
        const targetElement = document.getElementById(id);
        const offsetPosition = targetElement.offsetTop - navBar.offsetHeight;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }

    document.querySelector(".hero-text button").addEventListener("click", function() {
        scrollToSection('about');
    });

    document.querySelectorAll('.menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            menu.classList.remove("menu-active");
        });
    });

    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    let currentSlide = 0;
    let autoSlideInterval = null;
    let touchStartX = 0;
    let isDragging = false;

    function showSlide(idx) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === idx);
        });
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === idx);
        });
        currentSlide = idx;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % items.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + items.length) % items.length);
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    }

    if (prevBtn && nextBtn && items.length > 0) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide();
        });

        indicators.forEach((ind, i) => {
            ind.addEventListener('click', () => {
                showSlide(i);
                startAutoSlide();
            });
        });

        const carousel = document.querySelector('.gallery-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoSlide);
            carousel.addEventListener('mouseleave', startAutoSlide);
        }

        if (track) {
            track.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                isDragging = true;
            });

            track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const currentX = e.touches[0].clientX;
                const diff = currentX - touchStartX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        prevSlide();
                    } else {
                        nextSlide();
                    }
                    isDragging = false;
                    startAutoSlide();
                }
            });

            track.addEventListener('touchend', () => {
                isDragging = false;
            });
        }

        showSlide(0);
        startAutoSlide();
    }

    const galleryModal = document.getElementById('galleryModal');
    const galleryLightbox = document.getElementById('galleryLightbox');
    const modalClose = document.querySelector('.gallery-modal-close');
    const lightboxClose = document.querySelector('.gallery-lightbox-close');
    const lightboxImg = document.getElementById('galleryLightboxImg');
    const seeAllBtn = document.querySelector('.gallery-see-all-btn');

    function openGalleryModal() {
        galleryModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeGalleryModal() {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        galleryLightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        galleryLightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (seeAllBtn && galleryModal && modalClose) {
        seeAllBtn.addEventListener('click', openGalleryModal);
        modalClose.addEventListener('click', closeGalleryModal);
        
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) closeGalleryModal();
        });

        document.querySelectorAll('.gallery-modal-grid img, .carousel-img-group img').forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                openLightbox(img.src, img.alt);
            });
        });
    }

    if (galleryLightbox && lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
        galleryLightbox.addEventListener('click', (e) => {
            if (e.target === galleryLightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (galleryModal.style.display === 'flex') closeGalleryModal();
            if (galleryLightbox.style.display === 'flex') closeLightbox();
        }
    });

    const scrollTopBtn = document.querySelector('.scroll-top');
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});
