// --- Global Function for Section Navigation ---
// This function needs to be global to be accessible by the 'onclick' attributes in the HTML.
function showSection(sectionId) {
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        // Scroll to the top of the page smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// --- Main script execution after DOM is loaded ---
document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Element Selections ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    const contactForm = document.getElementById('contact-form');
    const contactFormStatus = document.getElementById('contact-form-status');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');

    // --- Helper Function for Mobile Menu ---
    function closeMobileMenu() {
        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            mobileDropdownToggles.forEach(toggle => {
                const dropdown = toggle.parentElement;
                const content = dropdown.querySelector('.mobile-dropdown-content');
                if (dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                    content.classList.remove('active');
                }
            });
        }
    }

    // --- Event Listeners ---

    // 1. Mobile Menu Toggle
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            const isActive = this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    // 2. Mobile Dropdowns
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const parentDropdown = this.parentElement;
            const content = parentDropdown.querySelector('.mobile-dropdown-content');
            const isAlreadyActive = parentDropdown.classList.contains('active');
            document.querySelectorAll('.mobile-dropdown').forEach(el => {
                if (el !== parentDropdown) {
                    el.classList.remove('active');
                    el.querySelector('.mobile-dropdown-content').classList.remove('active');
                }
            });
            if (!isAlreadyActive) {
                parentDropdown.classList.add('active');
                content.classList.add('active');
            } else {
                parentDropdown.classList.remove('active');
                content.classList.remove('active');
            }
        });
    });

    // 3. Close Mobile Menu on Link Click
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        if (!link.classList.contains('mobile-dropdown-toggle')) {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        }
    });

    // 4. Close Mobile Menu on Outside Click
    document.addEventListener('click', function(event) {
        if (mobileNav && mobileNav.classList.contains('active') && !mobileNav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });

    // 5. Close Mobile Menu on Resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileNav && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // 6. Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(contactForm);
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.textContent = 'Sending...';
            contactFormStatus.textContent = '';

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    contactFormStatus.textContent = "Thank you! Your message has been sent.";
                    contactFormStatus.style.color = 'green';
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        status.textContent = data.errors ? data.errors.map(e => e.message).join(", ") : "Oops! There was a problem.";
                        status.style.color = 'red';
                    });
                }
            }).catch(error => {
                contactFormStatus.textContent = "Oops! There was a network error.";
                contactFormStatus.style.color = 'red';
            }).finally(() => {
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.textContent = 'Send Message';
            });
        });
    }
});

// --- Optional: Page Load Animation ---
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});