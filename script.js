document.addEventListener('DOMContentLoaded', () => {
    // === Theme Toggle ===
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark-theme';
    body.className = savedTheme;

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('portfolio-theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('portfolio-theme', 'dark-theme');
        }
    });

    // === Ambient Mouse Glow Effect ===
    const ambientGlow = document.getElementById('ambient-glow');
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth lerp for background glow movement
    function animateGlow() {
        // Lerp formula: current + (target - current) * speed
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;

        ambientGlow.style.setProperty('--mouse-x', `${currentX}px`);
        ambientGlow.style.setProperty('--mouse-y', `${currentY}px`);

        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // === Mobile Navigation Menu ===
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mainHeader = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        mainHeader.classList.toggle('open-menu');

        // Animate hamburger menu button
        const bars = mobileMenuToggle.querySelectorAll('.bar');
        if (navMenu.classList.contains('open')) {
            bars[0].style.transform = 'translateY(8px) rotate(45deg)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mainHeader.classList.remove('open-menu');
            const bars = mobileMenuToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // === Hero Typing Animation ===
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = ["Full-Stack Applications", "AI-Powered Systems", "Robust APIs", "Dynamic Web Interfaces"];
    const typingSpeed = 80;
    const erasingSpeed = 40;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            setTimeout(type, typingSpeed + 500);
        }
    }

    // Start typing animation
    if (textArray.length) setTimeout(type, newTextDelay);

    // === Scroll Reveal Animation ===
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Trigger skill progress bars loading when skills section reveals
                if (entry.target.id === 'skills') {
                    const progressFills = entry.target.querySelectorAll('.progress-fill');
                    progressFills.forEach(fill => {
                        const width = fill.style.width;
                        fill.style.width = '0';
                        setTimeout(() => {
                            fill.style.width = width;
                        }, 100);
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // === Active Nav Link Tracking on Scroll ===
    const sections = document.querySelectorAll('section');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px' // Adjust bounds to match middle of the screen
    });

    sections.forEach(sec => scrollObserver.observe(sec));

    // === Skills Category Filtering ===
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // === Projects Filter ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // === Contact Form Handling ===
    const contactForm = document.getElementById('portfolio-contact-form');
    const formSubmitBtn = document.getElementById('form-submit-button');
    const formStatus = document.getElementById('form-status-message');

    contactForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);

        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Visual loading state
        formSubmitBtn.disabled = true;
        const originalBtnText = formSubmitBtn.innerHTML;
        formSubmitBtn.innerHTML = 'Sending Message... <span class="spinner"></span>';

        try {
            const response = await fetch('https://portfolio-backend-v6x7.onrender.com/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            });

            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error('Server returned an invalid response.');
            }

            if (response.ok && data.success === true) {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Thank you! Your message was sent successfully.';
                contactForm.reset();
            } else {
                formStatus.className = 'form-status error';
                formStatus.textContent = data.message || `Failed to send message (${response.status}).`;
            }

        } catch (error) {
            console.error('Error:', error);

            formStatus.className = 'form-status error';
            formStatus.textContent = error.message || 'Unable to connect to the server. Please try again.';
        }

        // Restore button
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnText;

        // Clear status after 5 seconds
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }, 5000);
    });
});