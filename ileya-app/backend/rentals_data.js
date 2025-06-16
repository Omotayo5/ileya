// ileya-app/backend/rentals_data.js

function getDemoRentals() {
    return [
        {
            id: 1,
            title: 'Modern Duplex in Lekki',
            city: 'lagos', // Corresponds to filter value
            state: 'Lagos',
            rental_price: 5000000,
            bedrooms: 4,
            property_type: 'duplex',
            photos: ['property-1.jpg']
        },
        {
            id: 2,
            title: 'Cozy Self-con in Yaba',
            city: 'lagos', // Corresponds to filter value
            state: 'Lagos',
            rental_price: 800000,
            bedrooms: 1,
            property_type: 'self-con',
            photos: ['property-2.jpg']
        },
        {
            id: 3,
            title: 'Spacious Apartment in Abuja',
            city: 'abuja', // Corresponds to filter value
            state: 'FCT',
            rental_price: 2500000,
            bedrooms: 3,
            property_type: 'apartment',
            photos: ['property-3.jpg']
        },
        {
            id: 4,
            title: 'Commercial Office Space',
            city: 'ibadan', // Corresponds to filter value
            state: 'Oyo',
            rental_price: 1200000,
            bedrooms: 0,
            property_type: 'office-space',
            photos: ['property-4.jpg']
        },
        {
            id: 5,
            title: 'Affordable Single Room in Benin',
            city: 'benin', // Corresponds to filter value
            state: 'Edo',
            rental_price: 250000,
            bedrooms: 1,
            property_type: 'single-room',
            photos: ['property-5.jpg']
        },
        {
            id: 6,
            title: 'Luxury Penthouse with a View',
            city: 'lagos', // Corresponds to filter value
            state: 'Lagos',
            rental_price: 12000000,
            bedrooms: 5,
            property_type: 'penthouse',
            photos: ['property-6.jpg']
        },
        {
            id: 7,
            title: 'Student Mini-Flat in Akure',
            city: 'ondo', // Corresponds to filter value
            state: 'Ondo',
            rental_price: 450000,
            bedrooms: 1,
            property_type: 'mini-flat',
            photos: ['property-7.jpg']
        }
    ];
}

module.exports = { getDemoRentals };
