<?php
require_once 'auth_check.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add New User - Ileya Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body class="bg-gray-100 font-sans">

    <!-- Admin Navigation Bar -->
    <nav class="bg-red-700 text-white p-4 shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
            <a href="admin_dashboard.php" class="text-2xl font-bold hover:text-red-200 transition-colors">Ileya Admin</a>
            <div class="space-x-1">
                <a href="admin_dashboard.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Dashboard</a>
                <a href="admin_users.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Users</a>
                <a href="admin_properties.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Properties</a>
                <a href="admin_settings.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Settings</a>
                <a href="admin_logout.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Logout</a>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container mx-auto mt-8 p-4">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-semibold text-gray-800">Add New User</h1>
            <a href="admin_users.php" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">
                &larr; Back to Users
            </a>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">Feature Under Construction</h2>
            <p class="text-gray-600 mb-6">The form to add a new user will be available here soon. Please check back later.</p>
            <img src="../images/icons/user-plus.svg" alt="Under Construction" class="mx-auto w-32 h-32 text-gray-400">
        </div>
    </div>

    <script src="../js/main.js"></script>
</body>
</html>
