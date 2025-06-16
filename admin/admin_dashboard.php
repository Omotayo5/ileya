<?php require_once 'auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Ileya</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body class="bg-gray-100">

    <!-- Admin Navigation -->
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

    <!-- Main Admin Content -->
    <div class="container mx-auto mt-8 p-4">
        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Summary Card 1: Registered Users -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-700 mb-2">Registered Users</h2>
                    <svg class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <p class="text-3xl font-bold text-blue-500">125</p> 
                <a href="admin_users.php" class="text-sm text-blue-500 hover:underline">View Users</a>
            </div>

            <!-- Summary Card 2: Active Rental Listings -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-700 mb-2">Active Rental Listings</h2>
                    <svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                <p class="text-3xl font-bold text-green-500">78</p> 
                <a href="admin_properties.php" class="text-sm text-green-500 hover:underline">View Properties</a>
            </div>

            <!-- Summary Card 3: Total Revenue -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-700 mb-2">Total Revenue</h2>
                    <svg class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p class="text-3xl font-bold text-purple-500">$5,250</p> 
                <a href="admin_reports.php" class="text-sm text-purple-500 hover:underline">View Reports</a>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <!-- Recent Activity -->
            <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
                <ul class="space-y-3">
                    <li class="flex items-center text-sm text-gray-600">
                        <span class="bg-green-500 h-2 w-2 rounded-full mr-3"></span>
                        New user registered: John Doe (john.doe@example.com) - <span class="ml-auto text-gray-500">Just now</span>
                    </li>
                    <li class="flex items-center text-sm text-gray-600">
                        <span class="bg-blue-500 h-2 w-2 rounded-full mr-3"></span>
                        Property <a href="admin_view_property_details.php?id=P079" class="text-red-600 hover:text-red-800 hover:underline ml-1">P079</a> listed: "Charming Downtown Loft" - <span class="ml-auto text-gray-500">1 hour ago</span>
                    </li>
                    <li class="flex items-center text-sm text-gray-600">
                        <span class="bg-yellow-500 h-2 w-2 rounded-full mr-3"></span>
                        Property <a href="admin_view_property_details.php?id=P075" class="text-red-600 hover:text-red-800 hover:underline ml-1">P075</a> status changed to Active - <span class="ml-auto text-gray-500">2 hours ago</span>
                    </li>
                    <li class="flex items-center text-sm text-gray-600">
                        <span class="bg-red-500 h-2 w-2 rounded-full mr-3"></span>
                        Admin login from new IP: 192.168.1.100 - <span class="ml-auto text-gray-500">Yesterday</span>
                    </li>
                </ul>
                <a href="admin_activity_log.php" class="mt-4 inline-block text-sm text-red-600 hover:text-red-800 hover:underline">View All Activity</a>
            </div>

            <!-- Quick Links -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold text-gray-700 mb-4">Quick Links</h2>
                <ul class="space-y-2">
                        <li><a href="admin_reports.php" class="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-md"><svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> View Reports</a></li>
                    <li><a href="admin_properties.php" class="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-md"><svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> Manage Properties</a></li>
                    <li><a href="admin_users.php" class="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-md"><svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> Manage Users</a></li>
                    <li><a href="admin_settings.php" class="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-md"><svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Site Settings</a></li>
                </ul>
            </div>
        </div>

    </div>

    <script src="../js/main.js"></script>
</body>
</html>
