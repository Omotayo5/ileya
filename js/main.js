// Main JavaScript file for Ileya

console.log("Ileya main.js loaded");

// Basic Google Maps initialization function (example)
// Ensure you have replaced YOUR_API_KEY in the script tag in index.html
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

        // Example marker
        // const marker = new google.maps.Marker({
        //     position: defaultLocation, // This should be property's coordinates
        //     map: map,
        //     title: "Property Location"
        // });
    } else {
        // console.log("No map element with ID 'propertyMap' found on this page.");
        // You might have a general map on the homepage or search results page
        // For example, a map showing multiple listings, which would require different logic.
    }
}


// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
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

// You can add more interactivity here as the project grows:
// - Form validation
// - Dynamic content loading
// - Image gallery functionality
// - etc.
