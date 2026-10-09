/**
 * MEENA KOTA - Modern UI & 3D Motion Interactions
 * Features: Mouse Parallax on Hero & Contact, 3D Card Hover Tilt, 3D Laptop Showcase,
 * Sticky Header ScrollSpy, Intersection Observer Reveals, and Form Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroMouseParallax();
    initCard3DTilt();
    initLaptop3DShowcase();
    initNavbarScroll();
    initScrollReveals();
    initMobileNav();
    initContactSectionParallax();
});

/**
 * 1. Hero 3D Mouse Parallax
 */
function initHeroMouseParallax() {
    const heroVisual = document.querySelector('.hero-visual-wrapper');
    if (!heroVisual || window.innerWidth < 868) return;

    const orb = document.querySelector('.profile-orb-container');
    const sphereYellow = document.querySelector('.sphere-yellow');
    const sphereBlue = document.querySelector('.sphere-blue');
    const sphereTranslucent = document.querySelector('.sphere-translucent');
    const techBadges = document.querySelectorAll('.floating-tech-badge');
    const creativeBadge = document.querySelector('.creative-badge');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        if (orb) orb.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
        if (sphereYellow) sphereYellow.style.transform = `translate(${x * -24}px, ${y * -20}px)`;
        if (sphereBlue) sphereBlue.style.transform = `translate(${x * 20}px, ${y * 18}px)`;
        if (sphereTranslucent) sphereTranslucent.style.transform = `translate(${x * -16}px, ${y * 22}px)`;
        if (creativeBadge) creativeBadge.style.transform = `rotate(-10deg) translate(${x * 14}px, ${y * 10}px)`;

        techBadges.forEach((badge, idx) => {
            const factor = (idx + 1) * 8;
            badge.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    }, { passive: true });
}

/**
 * 2. Realistic 3D Card Tilt for Summary, Skills, Projects, Education, & Contact Form
 */
function initCard3DTilt() {
    if (window.innerWidth < 768) return;

    const tiltCards = document.querySelectorAll('.summary-card, .skill-card, .project-item-card, .deliverable-card, .info-card, .edu-card-3d, .contact-form-card-3d, .timeline-card-modern');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3.5;
            const rotateY = ((x - centerX) / centerX) * 3.5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)';
        });
    });
}

/**
 * 3. 3D Floating Laptop Showcase Interaction ("Things I've Built")
 */
function initLaptop3DShowcase() {
    const laptop = document.querySelector('.laptop-frame');
    const showcaseSection = document.querySelector('.showcase-3d-section');
    if (!laptop || !showcaseSection) return;

    let baseAngle = 0;
    let scrollOffset = 0;

    window.addEventListener('scroll', () => {
        const rect = showcaseSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            scrollOffset = (progress - 0.5) * 15;
        }
    }, { passive: true });

    function animateLaptop() {
        baseAngle = Math.sin(Date.now() * 0.0012) * 4.5;
        laptop.style.transform = `perspective(1200px) rotateX(${8 - scrollOffset * 0.3}deg) rotateY(${baseAngle}deg) translateY(${-scrollOffset}px)`;
        requestAnimationFrame(animateLaptop);
    }
    animateLaptop();
}

/**
 * 4. Contact Section 3D Mouse Parallax (Grad Cap, Paper Plane, Potted Plant)
 */
function initContactSectionParallax() {
    const contactSection = document.querySelector('.contact-section');
    const paperPlane = document.querySelector('.paper-plane-3d-img');
    const pottedPlant = document.querySelector('.potted-plant-img');
    const gradCap = document.querySelector('.edu-3d-img');

    if (window.innerWidth < 868) return;

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        if (paperPlane && contactSection) {
            const rect = contactSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                paperPlane.style.transform = `translate(${x * -25}px, ${y * -20}px) rotate(${x * 8}deg)`;
            }
        }

        if (pottedPlant) {
            pottedPlant.style.transform = `rotate(${x * 4}deg) translate(${x * 6}px, ${y * 4}px)`;
        }

        if (gradCap) {
            gradCap.style.transform = `translate(${x * 12}px, ${y * 10}px) rotate(${x * -4}deg)`;
        }
    }, { passive: true });
}

/**
 * 5. Sticky Navbar Shrink & ScrollSpy
 */
function initNavbarScroll() {
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        if (scrollPos > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        let currentId = '';
        sections.forEach(section => {
            const top = section.offsetTop - 140;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

/**
 * 6. Intersection Observer Scroll Reveals
 */
function initScrollReveals() {
    const revealTargets = document.querySelectorAll(
        '.summary-card, .skill-card, .project-item-card, .info-card, .edu-card-3d, .timeline-card, .timeline-card-modern, .section-title, .about-text, .contact-info-card, .contact-form-card-3d'
    );

    revealTargets.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const parent = el.parentElement;
                let delay = 0;

                if (parent && parent.children) {
                    const idx = Array.from(parent.children).indexOf(el);
                    delay = (idx % 5) * 90;
                }

                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay);

                obs.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    revealTargets.forEach(el => observer.observe(el));
}

/**
 * 7. Mobile Navigation Drawer
 */
function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#FFFFFF';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }
        });

        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            });
        });
    }
}

/**
 * 8. Interactive Contact Form Submission
 */
function handleFormSubmit(event) {
    event.preventDefault();
    const btn = document.getElementById('submitBtn');
    const form = document.getElementById('portfolioContactForm');
    const successAlert = document.getElementById('formSuccessMessage');

    if (!btn || !form) return;

    // Button animation
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    btn.style.opacity = '0.85';
    btn.disabled = true;

    setTimeout(() => {
        form.reset();
        btn.style.display = 'none';
        if (successAlert) {
            successAlert.style.display = 'flex';
        }
    }, 1200);
}

