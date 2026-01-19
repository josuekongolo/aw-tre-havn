/**
 * AW Tre & Havn - Main JavaScript
 * Carpentry Company Website
 */

(function() {
    'use strict';

    // ===================================
    // DOM Ready
    // ===================================
    document.addEventListener('DOMContentLoaded', function() {
        initMobileNavigation();
        initSmoothScroll();
        initContactForm();
        initHeaderScroll();
        initScrollToHash();
    });

    // ===================================
    // Mobile Navigation
    // ===================================
    function initMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Toggle aria-expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);

            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===================================
    // Scroll to Hash on Page Load
    // ===================================
    function initScrollToHash() {
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);

            if (target) {
                // Wait for page to fully load
                setTimeout(function() {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }

    // ===================================
    // Header Scroll Effect
    // ===================================
    function initHeaderScroll() {
        const header = document.querySelector('.header');

        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add shadow on scroll
            if (currentScroll > 10) {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
            }

            lastScroll = currentScroll;
        });
    }

    // ===================================
    // Contact Form Handler
    // ===================================
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const formMessage = document.getElementById('form-message');

        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: form.querySelector('#name').value.trim(),
                email: form.querySelector('#email').value.trim(),
                phone: form.querySelector('#phone').value.trim(),
                location: form.querySelector('#location').value.trim(),
                projectType: form.querySelector('#project-type').value,
                description: form.querySelector('#description').value.trim(),
                siteVisit: form.querySelector('#site-visit').checked
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.description) {
                showFormMessage('error', 'Vennligst fyll ut alle påkrevde felt.');
                return;
            }

            // Email validation
            if (!isValidEmail(formData.email)) {
                showFormMessage('error', 'Vennligst oppgi en gyldig e-postadresse.');
                return;
            }

            // Phone validation (Norwegian format)
            if (!isValidPhone(formData.phone)) {
                showFormMessage('error', 'Vennligst oppgi et gyldig telefonnummer.');
                return;
            }

            // Disable submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sender...</span>';

            try {
                // Simulate form submission (replace with actual API call)
                await simulateFormSubmission(formData);

                // Show success message
                showFormMessage('success', 'Takk for din henvendelse! Jeg vil kontakte deg så snart som mulig, vanligvis innen én virkedag.');

                // Reset form
                form.reset();

            } catch (error) {
                // Show error message
                showFormMessage('error', 'Beklager, noe gikk galt. Vennligst prøv igjen eller ring meg direkte.');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });

        // Real-time validation feedback
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                // Remove error styling on input
                this.style.borderColor = '';
            });
        });
    }

    // ===================================
    // Helper Functions
    // ===================================

    function showFormMessage(type, message) {
        const formMessage = document.getElementById('form-message');
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type + ' show';

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto-hide success message after 10 seconds
        if (type === 'success') {
            setTimeout(function() {
                formMessage.classList.remove('show');
            }, 10000);
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Remove spaces, dashes, and plus sign for validation
        const cleanPhone = phone.replace(/[\s\-\+]/g, '');
        // Norwegian phone numbers: 8 digits, optionally starting with 47
        const phoneRegex = /^(47)?[2-9]\d{7}$/;
        return phoneRegex.test(cleanPhone);
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        if (field.required && !value) {
            isValid = false;
        }

        if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
        }

        if (field.type === 'tel' && value && !isValidPhone(value)) {
            isValid = false;
        }

        if (!isValid) {
            field.style.borderColor = '#dc3545';
        } else {
            field.style.borderColor = '#2D5016';
        }

        return isValid;
    }

    function simulateFormSubmission(formData) {
        // This simulates a form submission
        // In production, replace this with actual API call to Resend or similar service
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                // Log form data for testing
                console.log('Form submission:', formData);

                // Simulate success (90% of the time)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 1500);
        });
    }

    // ===================================
    // Utility: Debounce Function
    // ===================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===================================
    // Lazy Load Images (if needed)
    // ===================================
    function initLazyLoad() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.dataset.src;
                        image.removeAttribute('data-src');
                        imageObserver.unobserve(image);
                    }
                });
            });

            images.forEach(function(image) {
                imageObserver.observe(image);
            });
        } else {
            // Fallback for older browsers
            images.forEach(function(image) {
                image.src = image.dataset.src;
            });
        }
    }

})();
