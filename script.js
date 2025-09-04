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

    // --- Helper Function ---
    // Closes the mobile menu and resets its state.
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll

        // Close all open dropdowns within the mobile menu
        mobileDropdownToggles.forEach(toggle => {
            const dropdown = toggle.parentElement;
            const content = dropdown.querySelector('.mobile-dropdown-content');
            if (dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
                content.classList.remove('active');
            }
        });
    }

    // --- Event Listeners ---

    // 1. Toggle mobile menu on hamburger button click
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent this click from being caught by the 'document' listener
            const isActive = this.classList.toggle('active');
            mobileNav.classList.toggle('active');

            // Prevent body from scrolling when the menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    // 2. Handle mobile dropdown toggles (accordion style)
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const parentDropdown = this.parentElement;
            const content = parentDropdown.querySelector('.mobile-dropdown-content');
            const isAlreadyActive = parentDropdown.classList.contains('active');

            // First, close all other dropdowns
            document.querySelectorAll('.mobile-dropdown').forEach(el => {
                if (el !== parentDropdown) {
                    el.classList.remove('active');
                    el.querySelector('.mobile-dropdown-content').classList.remove('active');
                }
            });

            // Then, toggle the clicked dropdown
            if (!isAlreadyActive) {
                parentDropdown.classList.add('active');
                content.classList.add('active');
            } else {
                parentDropdown.classList.remove('active');
                content.classList.remove('active');
            }
        });
    });

    // 3. Close mobile menu when a navigation link is clicked
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        // This listener applies to all links, including dropdown toggles.
        // The showSection() function is called from the HTML onclick.
        // We only close the menu if the link is NOT a dropdown toggle button.
        if (!link.classList.contains('mobile-dropdown-toggle')) {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        }
    });

    // 4. Close mobile menu when clicking outside of it
    document.addEventListener('click', function(event) {
        if (mobileNav && mobileNav.classList.contains('active') && !mobileNav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });

    // 5. Close mobile menu on window resize (if switching to desktop view)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileNav && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// --- Optional: Page Load Animation ---
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// --- Contact Form Submission Handler ---
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('contact-form-status');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default page reload

            const formData = new FormData(form);
            
            // Update button and status for user feedback
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            status.textContent = '';

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    status.textContent = "Thank you! Your message has been sent.";
                    status.style.color = 'green';
                    form.reset(); // Clear the form fields
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            status.textContent = "Oops! There was a problem submitting your form.";
                        }
                        status.style.color = 'red';
                    })
                }
            }).catch(error => {
                status.textContent = "Oops! There was a problem submitting your form.";
                status.style.color = 'red';
            }).finally(() => {
                // Re-enable the button after submission attempt
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
        });
    }
});