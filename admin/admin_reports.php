<?php 
require_once 'auth_check.php'; 
require_once 'reports_data.php';

$report_data = get_demo_report_data();
$summary = calculate_report_summary($report_data);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financial Reports - Ileya Admin</title>
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
            <h1 class="text-3xl font-semibold text-gray-800">Financial Reports</h1>
            <a href="admin_dashboard.php" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors">
                &larr; Back to Dashboard
            </a>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">Property Listing Promotions Revenue</h2>
            
            <!-- Filters (Placeholder for future PHP integration) -->
            <div class="mb-6 flex flex-wrap gap-4 items-end">
                <div>
                    <label for="date-range" class="block text-sm font-medium text-gray-700 mb-1">Date Range:</label>
                    <input type="date" id="date-from" name="date-from" class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                    <span class="mx-2 text-gray-500">to</span>
                    <input type="date" id="date-to" name="date-to" class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Promotion Type:</label>
                    <p class="mt-1 px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm sm:text-sm text-gray-700">Boosted Visibility</p>
                </div>
                <button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors">Apply Filters</button>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-red-50 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-red-700">Total Revenue</h3>
                    <p class="text-2xl font-bold text-red-900">$<?php echo htmlspecialchars($summary['total_revenue']); ?></p>
                    <p class="text-sm text-red-600">Last 30 days (Demo)</p>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-blue-700">Boosted Listings Sold</h3>
                    <p class="text-2xl font-bold text-blue-900"><?php echo htmlspecialchars($summary['promotions_sold']); ?></p>
                    <p class="text-sm text-blue-600">Last 30 days (Demo)</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-green-700">Avg. Revenue / Promotion</h3>
                    <p class="text-2xl font-bold text-green-900">$<?php echo htmlspecialchars($summary['avg_revenue_promo']); ?></p>
                    <p class="text-sm text-green-600">Last 30 days (Demo)</p>
                </div>
            </div>

            <!-- Report Table -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property ID</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion Type</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <?php foreach ($report_data as $row): ?>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($row['transaction_id']); ?></td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><a href="admin_view_property_details.php?id=<?php echo htmlspecialchars($row['property_id']); ?>" class="text-red-600 hover:text-red-800 hover:underline"><?php echo htmlspecialchars($row['property_id']); ?></a></td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($row['promotion_type']); ?></td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($row['date']); ?></td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><a href="admin_view_user_details.php?id=<?php echo htmlspecialchars($row['user_id']); ?>" class="text-red-600 hover:text-red-800 hover:underline"><?php echo htmlspecialchars($row['user_id']); ?></a></td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">$<?php echo htmlspecialchars(number_format($row['amount'], 2)); ?></td>
                        </tr>
                        <?php endforeach; ?>
                        <?php if (empty($report_data)): ?>
                        <tr>
                            <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No report data available.</td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <!-- Pagination (Placeholder - PHP integration needed for actual pagination) -->
            <div class="mt-6 flex justify-center">
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-700 transition-colors">
                        Previous
                    </a>
                    <a href="#" aria-current="page" class="z-10 bg-red-600 border-red-600 text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        1
                    </a>
                    <a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-700 transition-colors relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        2
                    </a>
                    <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-700 transition-colors">
                        Next
                    </a>
                </nav>
            </div>
        </div>
    </div>

    <script src="../js/main.js"></script>
</body>
</html>
