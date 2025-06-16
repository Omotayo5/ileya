<?php

function get_demo_users_data() {
    return [
        [
            'id' => 'U001',
            'name' => 'Alice Wonderland',
            'email' => 'alice@example.com',
            'role' => 'Landlord',
            'date_registered' => '2023-01-15',
            'listings_count' => 2,
            'status' => 'Active',
            'profile_image_url' => '../images/users/user1.jpg' // Example image path
        ],
        [
            'id' => 'U002',
            'name' => 'Bob The Builder',
            'email' => 'bob@example.com',
            'role' => 'Tenant',
            'date_registered' => '2023-03-22',
            'listings_count' => 0,
            'status' => 'Active',
            'profile_image_url' => '../images/users/user2.jpg'
        ],
        [
            'id' => 'U003',
            'name' => 'Carol Danvers',
            'email' => 'carol@example.com',
            'role' => 'Agent',
            'date_registered' => '2023-05-10',
            'listings_count' => 5,
            'status' => 'Suspended',
            'profile_image_url' => '../images/users/user3.jpg'
        ],
        [
            'id' => 'U004',
            'name' => 'David Copperfield',
            'email' => 'david@example.com',
            'role' => 'Landlord',
            'date_registered' => '2023-07-01',
            'listings_count' => 1,
            'status' => 'Active',
            'profile_image_url' => '../images/users/user4.jpg'
        ],
        [
            'id' => 'U005',
            'name' => 'Eve Harrington',
            'email' => 'eve@example.com',
            'role' => 'Tenant',
            'date_registered' => '2023-09-05',
            'listings_count' => 0,
            'status' => 'Pending Approval',
            'profile_image_url' => '../images/users/user5.jpg'
        ]
    ];
}

?>
