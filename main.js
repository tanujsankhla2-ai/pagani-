/* =========================================
   Pagani Zonda | main.js
   Premium Hypercar Landing Page — JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ── GSAP Plugin Registration ── */
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ══════════════════════════════════════════
       1. NAVBAR — Scroll + Transparency
    ══════════════════════════════════════════ */
    const navbar = document.getElementById('navbar');

    const handleNavScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();


    /* ══════════════════════════════════════════
       2. MOBILE MENU TOGGLE
    ══════════════════════════════════════════ */
    const mobileMenuBtn  = document.getElementById('mobile-menu-btn');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const mobileMenu     = document.getElementById('mobile-menu');
    const mobileLinks    = document.querySelectorAll('.mobile-link, .mobile-cta');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    mobileMenuBtn?.addEventListener('click', openMobileMenu);
    mobileCloseBtn?.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close on escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });


    /* ══════════════════════════════════════════
       3. FAQ ACCORDION
    ══════════════════════════════════════════ */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const btn    = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        btn?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherBtn    = otherItem.querySelector('.faq-question');
                if (otherAnswer) otherAnswer.style.maxHeight = null;
                if (otherBtn)    otherBtn.setAttribute('aria-expanded', 'false');
            });

            // Open clicked if not already active
            if (!isActive) {
                item.classList.add('active');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    /* ══════════════════════════════════════════
       4. COUNTER ANIMATION
    ══════════════════════════════════════════ */
    const counterElements = document.querySelectorAll('[data-count]');

    const animateCounter = (el) => {
        const target   = parseInt(el.getAttribute('data-count'), 10);
        const duration = 2000; // ms
        const start    = performance.now();
        const isLarge  = target > 999;
        const step = (now) => {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = isLarge ? value.toLocaleString() : value;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = isLarge ? target.toLocaleString() : target;
        };
        requestAnimationFrame(step);
    };

    // Trigger counters when why-stats-grid is in view
    const counterSection = document.querySelector('.why-stats-grid');
    if (counterSection) {
        let counted = false;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    counterElements.forEach(el => animateCounter(el));
                    counterObserver.disconnect();
                }
            });
        }, { threshold: 0.4 });

        counterObserver.observe(counterSection);
    }


    /* ══════════════════════════════════════════
       5. NEWSLETTER FORM
    ══════════════════════════════════════════ */
    const newsletterForm = document.getElementById('newsletter-form');
    const submitBtn      = document.getElementById('newsletter-submit');

    newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email')?.value;
        if (!email) return;

        // Simulate submission
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i>&nbsp; Welcome to the Club';
            submitBtn.disabled  = true;
            submitBtn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
            submitBtn.style.color      = '#fff';
        }

        setTimeout(() => {
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>&nbsp; Join the Club';
                submitBtn.disabled  = false;
                submitBtn.style.background = '';
                submitBtn.style.color      = '';
            }
            if (newsletterForm) newsletterForm.reset();
        }, 4000);
    });


    /* ══════════════════════════════════════════
       6. GSAP ANIMATIONS
    ══════════════════════════════════════════ */
    if (window.gsap) {

        /* ── Hero entrance sequence ── */
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        heroTl
            .from('#hero-badge', {
                opacity: 0, y: -15, duration: 0.7, delay: 0.3
            })
            .from('#hero-title', {
                opacity: 0, y: 60, duration: 1.1
            }, '-=0.4')
            .from('#hero-subtitle', {
                opacity: 0, y: 30, duration: 0.9
            }, '-=0.7')
            .from('#hero-actions', {
                opacity: 0, y: 25, duration: 0.7
            }, '-=0.6')
            .from('#hero-trust', {
                opacity: 0, y: 15, duration: 0.6
            }, '-=0.5')
            .from('.scroll-indicator', {
                opacity: 0, duration: 0.5
            }, '-=0.3');


        /* ── Hero slideshow parallax on scroll ── */
        if (window.ScrollTrigger) {
            gsap.to('.hero-slideshow', {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });

            /* ── Engineering cards stagger ── */
            gsap.from('.eng-card', {
                y: 80,
                opacity: 0,
                duration: 0.9,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.engineering-grid',
                    start: 'top 85%'
                }
            });

            /* ── Story section ── */
            gsap.from('.story-image', {
                x: -60,
                opacity: 0,
                duration: 1.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.story-grid',
                    start: 'top 78%'
                }
            });

            gsap.from('.story-content', {
                x: 60,
                opacity: 0,
                duration: 1.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.story-grid',
                    start: 'top 78%'
                }
            });

            gsap.from('.story-glass-card', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                delay: 0.4,
                ease: 'back.out(1.4)',
                scrollTrigger: {
                    trigger: '.story-image',
                    start: 'top 75%'
                }
            });

            /* ── Model cards ── */
            gsap.from('.model-card', {
                y: 100,
                opacity: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.models-grid',
                    start: 'top 85%'
                }
            });

            /* ── Why Pagani ── */
            gsap.from('.why-list li', {
                x: -40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.why-list',
                    start: 'top 85%'
                }
            });

            gsap.from('.why-stat-card', {
                y: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.why-stats-grid',
                    start: 'top 85%'
                }
            });

            /* ── Timeline items ── */
            gsap.from('.perf-item', {
                x: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.perf-timeline',
                    start: 'top 80%'
                }
            });

            /* ── Press logos ── */
            gsap.from('.press-logos span', {
                opacity: 0,
                y: 15,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.press-logos',
                    start: 'top 88%'
                }
            });

            /* ── Testimonials ── */
            gsap.from('.testimonial-card', {
                y: 60,
                opacity: 0,
                duration: 0.9,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.testimonials-grid',
                    start: 'top 82%'
                }
            });

            /* ── CTA section ── */
            gsap.from('.cta-inner > *', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.cta-section',
                    start: 'top 75%'
                }
            });

            /* ── Newsletter ── */
            gsap.from('.newsletter-box', {
                y: 50,
                opacity: 0,
                duration: 0.9,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.newsletter-box',
                    start: 'top 82%'
                }
            });

            /* ── Section headers (tags, titles, descriptions) ── */
            gsap.utils.toArray('.section-header').forEach(header => {
                gsap.from(header.querySelectorAll('.section-tag, .section-title, .section-desc'), {
                    y: 35,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 85%'
                    }
                });
            });

        } // end if ScrollTrigger

    } // end if gsap


    /* ══════════════════════════════════════════
       7. MAGNETIC BUTTON EFFECT (CTA buttons)
    ══════════════════════════════════════════ */
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-glass');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect   = btn.getBoundingClientRect();
            const x      = e.clientX - rect.left - rect.width  / 2;
            const y      = e.clientY - rect.top  - rect.height / 2;
            const factor = 0.18;
            btn.style.transform = `translate(${x * factor}px, ${y * factor}px) translateY(-3px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });


    /* ══════════════════════════════════════════
       8. SMOOTH ACTIVE NAV HIGHLIGHTING
    ══════════════════════════════════════════ */
    const sections   = document.querySelectorAll('section[id]');
    const navLinks   = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active-nav');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active-nav');
                        link.style.color = 'var(--clr-silver)';
                    } else {
                        link.style.color = '';
                    }
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(sec => sectionObserver.observe(sec));


    /* ══════════════════════════════════════════
       9. LAZY IMAGE LOADING ENHANCEMENT
    ══════════════════════════════════════════ */
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    obs.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });

        lazyImages.forEach(img => {
            img.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
            imgObserver.observe(img);
        });
    }


    /* ══════════════════════════════════════════
       10. MARQUEE PAUSE ON HOVER
          (handled via CSS, but also JS as fallback)
    ══════════════════════════════════════════ */
    const marquee = document.querySelector('.marquee');
    const marqueeWrapper = document.querySelector('.marquee-wrapper');

    marqueeWrapper?.addEventListener('mouseenter', () => {
        if (marquee) marquee.style.animationPlayState = 'paused';
    });
    marqueeWrapper?.addEventListener('mouseleave', () => {
        if (marquee) marquee.style.animationPlayState = 'running';
    });

}); // end DOMContentLoaded
