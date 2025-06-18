console.log("Ileya main.js loaded");

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        console.log('Mobile menu button and menu element found.');
        mobileMenuButton.addEventListener('click', function () {
            console.log('Mobile menu button clicked.');
            mobileMenu.classList.toggle('hidden');
        });
    } else {
        console.error('Mobile menu button or menu element not found!');
    }

    // Footer copyright year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    } else {
        console.log('currentYear span not found.');
    }
    
    // Smooth scroll for anchor links (optional)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            // Check if it's more than just a '#' (e.g. an actual anchor)
            if (hrefAttribute && hrefAttribute.length > 1) {
                const targetElement = document.querySelector(hrefAttribute);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});


// Basic Google Maps initialization function (example)
// This function is called by the Google Maps script tag, so it needs to be in the global scope.
// Ensure you have replaced YOUR_API_KEY in the script tag in your HTML.
function initMap() {
    // Default location (e.g., Lagos, Nigeria)
    const defaultLocation = { lat: 6.5244, lng: 3.3792 }; 

    // Check if a specific map element exists (e.g., on property details page)
    const mapElement = document.getElementById('propertyMap');
    
    if (mapElement) {
        const map = new google.maps.Map(mapElement, {
            zoom: 15,
            center: defaultLocation, // This should be dynamic based on property location
        });

        // Example marker (can be uncommented and used)
        /*
        const marker = new google.maps.Marker({
            position: defaultLocation, // This should be property's coordinates
            map: map,
            title: "Property Location"
        });
        */
    } else {
        // console.log("No map element with ID 'propertyMap' found on this page.");
    }
}


// You can add more interactivity here as the project grows:
// - Form validation
// - Dynamic content loading
// - Image gallery functionality
// - etc.
