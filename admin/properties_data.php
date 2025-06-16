<?php

function get_demo_properties_data() {
    return [
        [
            'id' => 'P001',
            'title' => 'Spacious 2-Bed Apartment',
            'address' => '123 Main St, Anytown, AT 12345',
            'listed_by_id' => 'U001',
            'listed_by_email' => 'landlord_alpha@example.com',
            'rent_per_month' => 1200.00,
            'status' => 'Active',
            'date_listed' => '2024-05-01',
            'image_url' => '../images/properties/property1.jpg' // Example image path
        ],
        [
            'id' => 'P002',
            'title' => 'Cozy Studio Downtown',
            'address' => '456 Oak Ave, Cityville, CV 67890',
            'listed_by_id' => 'U002',
            'listed_by_email' => 'agent_beta@example.com',
            'rent_per_month' => 850.00,
            'status' => 'Active',
            'date_listed' => '2024-05-10',
            'image_url' => '../images/properties/property2.jpg'
        ],
        [
            'id' => 'P003',
            'title' => 'Modern 3-Bedroom House with Yard',
            'address' => '789 Pine Ln, Suburbia, SU 10112',
            'listed_by_id' => 'U001',
            'listed_by_email' => 'landlord_alpha@example.com',
            'rent_per_month' => 2200.00,
            'status' => 'Rented',
            'date_listed' => '2024-04-15',
            'image_url' => '../images/properties/property3.jpg'
        ],
        [
            'id' => 'P004',
            'title' => 'Chic Urban Loft',
            'address' => '101 Market St, Metropolis, MP 13141',
            'listed_by_id' => 'U003',
            'listed_by_email' => 'owner_gamma@example.com',
            'rent_per_month' => 1750.00,
            'status' => 'Pending Approval',
            'date_listed' => '2024-05-20',
            'image_url' => '../images/properties/property4.jpg'
        ],
        [
            'id' => 'P005',
            'title' => 'Quiet Suburban Family Home',
            'address' => '222 Maple Dr, Greenfield, GF 15161',
            'listed_by_id' => 'U002',
            'listed_by_email' => 'agent_beta@example.com',
            'rent_per_month' => 1900.00,
            'status' => 'Active',
            'date_listed' => '2024-05-05',
            'image_url' => '../images/properties/property5.jpg'
        ]
    ];
}

?>
