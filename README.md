# Ileya - Real Estate Listing Platform

Ileya is a modern, plug-and-play real estate listing platform designed for individuals to list and find rental properties.

## Project Goal

To provide an easy-to-use, mobile-first platform where any user can list properties for rent and find suitable rental accommodations.

## Current Status - Frontend Foundation

This repository currently contains the initial HTML and Tailwind CSS structure for the frontend of the application. 

### Key Files Created:

- `index.html`: The main landing page.
- `properties.html`: Page to browse all property listings.
- `property-details.html`: Template for individual property detail views.
- `user-profile.html`: Public-facing page for users, showing their rental listings.
- `user-dashboard.html`: Dashboard for users to manage their rental listings.
- `login.html`: User/Realtor login page.
- `register.html`: User/Realtor registration page.
- `css/style.css`: For any custom CSS supplementing Tailwind.
- `js/main.js`: For client-side JavaScript interactivity.
- `images/`: Folder for static image assets.

### Tech Stack (Frontend):

- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript (for basic interactivity)

## Features to Implement (as per initial request):

1.  A mobile-first property rental listing site where all users can create accounts and list properties for rent.
2.  Each rental property listing should include:
    - Property title, rental price (e.g., ₦1,500,000/year), description, location (with Google Maps or GPS embed).
    - Image gallery and video tour embed (YouTube or direct upload).
    - WhatsApp contact integration for quick inquiries to the lister.
3.  User dashboard for all users to manage their rental listings, update availability, and get basic analytics on their listings.
4.  Public-facing page for each user (like a mini-site) showing all their rental listings and contact details.
5.  Optional: Enable SEO-friendly URLs and categories like “Apartments for Rent,” “Houses for Rent,” “Rooms for Rent,” etc.

## Getting Started

1.  Clone or download this repository.
2.  Open `index.html` in your web browser to view the current state of the landing page.
3.  **Important for Maps**: If you want to use the Google Maps embeds, you'll need to get a Google Maps JavaScript API key and replace `YOUR_API_KEY` in the `<script>` tag in `index.html` (and later in `property-details.html`).

## Next Steps

-   Flesh out the content and styling for each page.
-   Implement JavaScript for dynamic features (e.g., image galleries, form submissions - though this will require a backend).
-   Develop the backend to handle data, user accounts, and property management.
