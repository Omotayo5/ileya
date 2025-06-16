<?php 
require_once 'auth_check.php'; 
require_once 'properties_data.php';

$properties = get_demo_properties_data();

// Helper function to determine status badge color
function get_status_badge_class($status) {
    switch (strtolower($status)) {
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'rented':
            return 'bg-yellow-100 text-yellow-800';
        case 'pending approval':
            return 'bg-blue-100 text-blue-800';
        case 'delisted':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Properties - Ileya Admin</title>
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
                <a href="admin_properties.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold">Properties</a>
                <a href="admin_settings.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Settings</a>
                <a href="admin_logout.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Logout</a>
            </div>
        </div>
    </nav>

    <!-- Main Admin Content -->
    <div class="container mx-auto mt-8 p-4">
        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Manage Properties</h1>

        <!-- Property Management Table -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-700">All Rental Properties</h2>
                <button onclick="location.href='admin_add_property.php'" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors">
                    Add New Property
                </button>
            </div>

            <!-- Search/Filter (Placeholder) -->
            <div class="mb-4">
                <input type="text" placeholder="Search properties (e.g., address, user, status)..." class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed By</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent/Month</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Listed</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <?php if (empty($properties)): ?>
                            <tr>
                                <td colspan="8" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No properties found.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($properties as $property): ?>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($property['id']); ?></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><?php echo htmlspecialchars($property['title']); ?></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($property['address']); ?></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><a href="admin_view_user_details.php?id=<?php echo htmlspecialchars($property['listed_by_id']); ?>" class="text-red-600 hover:underline"><?php echo htmlspecialchars($property['listed_by_email']); ?></a></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$<?php echo htmlspecialchars(number_format($property['rent_per_month'], 2)); ?></td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full <?php echo get_status_badge_class($property['status']); ?>">
                                        <?php echo htmlspecialchars($property['status']); ?>
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($property['date_listed']); ?></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a href="admin_view_property_details.php?id=<?php echo htmlspecialchars($property['id']); ?>" class="text-blue-600 hover:text-blue-900 mr-2">View</a>
                                    <a href="#" onclick="deleteProperty(this, '<?php echo htmlspecialchars($property['id']); ?>')" class="bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1 px-3 rounded-md shadow-sm transition-colors cursor-pointer">Delete</a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <!-- Pagination (Placeholder) -->
            <div class="mt-4 flex items-center justify-between">
                <p class="text-sm text-gray-700">
                    Showing <span class="font-medium">1</span> to <span class="font-medium"><?php echo count($properties); ?></span> of <span class="font-medium"><?php echo count($properties); ?></span> results (Demo)
                </p>
                <div class="flex-1 flex justify-between sm:justify-end">
                    <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-50 hover:text-red-700 transition-colors">
                        Previous
                    </a>
                    <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-50 hover:text-red-700 transition-colors">
                        Next
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script src="../js/main.js"></script>
    <script>
        function deleteProperty(buttonElement, propertyId) {
            if (confirm(`Are you sure you want to delete property ${propertyId}? This action cannot be undone (demo only).`)) {
                // Find the table row (tr) closest to the button and remove it for demo purposes
                const row = buttonElement.closest('tr');
                if (row) {
                    row.remove();
                    // Update the count in pagination (simple demo update)
                    const resultCountSpans = document.querySelectorAll('.mt-4 .text-sm.text-gray-700 span.font-medium');
                    if (resultCountSpans.length === 3) {
                        const currentShown = parseInt(resultCountSpans[1].textContent);
                        const totalResults = parseInt(resultCountSpans[2].textContent);
                        if (currentShown > 0) resultCountSpans[1].textContent = currentShown -1;
                        if (totalResults > 0) resultCountSpans[2].textContent = totalResults -1;
                         if (currentShown -1 === 0) resultCountSpans[0].textContent = 0; // if showing becomes 0
                    }
                    console.log(`Property ${propertyId} visually removed.`);
                } else {
                    console.error('Could not find the row to remove.');
                }
            }
        }
    </script>
</body>
</html>
