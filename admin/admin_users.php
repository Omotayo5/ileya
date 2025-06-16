<?php 
require_once 'auth_check.php'; 
require_once 'users_data.php';

$users = get_demo_users_data();

// Helper function to determine status badge color
function get_user_status_badge_class($status) {
    switch (strtolower($status)) {
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'suspended':
            return 'bg-red-100 text-red-800';
        case 'pending approval':
            return 'bg-yellow-100 text-yellow-800'; // Or another color like blue
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
    <title>Manage Users - Ileya Admin</title>
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
                <a href="admin_users.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold">Users</a>
                <a href="admin_properties.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Properties</a>
                <a href="admin_settings.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Settings</a>
                <a href="admin_logout.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Logout</a>
            </div>
        </div>
    </nav>

    <!-- Main Admin Content -->
    <div class="container mx-auto mt-8 p-4">
        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Manage Users</h1>

        <!-- User Management Table -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-700">All Registered Users</h2>
                <button onclick="location.href='admin_add_user.php'" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors">
                    Add New User
                </button>
            </div>

            <!-- Search/Filter (Placeholder) -->
            <div class="mb-4">
                <input type="text" placeholder="Search users (e.g., name, email, status)..." class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Registered</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listings</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <?php if (empty($users)): ?>
                            <tr>
                                <td colspan="8" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No users found.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($users as $user): ?>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($user['id']); ?></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><?php echo htmlspecialchars($user['name']); ?></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($user['email']); ?></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($user['role']); ?></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($user['date_registered']); ?></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"><?php echo htmlspecialchars($user['listings_count']); ?></td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full <?php echo get_user_status_badge_class($user['status']); ?>">
                                        <?php echo htmlspecialchars($user['status']); ?>
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a href="admin_view_user_details.php?id=<?php echo htmlspecialchars($user['id']); ?>" class="text-blue-600 hover:text-blue-900 mr-2">View</a>
                                    <?php if (strtolower($user['status']) === 'active'): ?>
                                        <a href="#" onclick="toggleUserStatus(this, '<?php echo htmlspecialchars($user['id']); ?>', 'Active')" class="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium py-1 px-3 rounded-md shadow-sm transition-colors">Suspend</a>
                                    <?php elseif (strtolower($user['status']) === 'suspended'): ?>
                                        <a href="#" onclick="toggleUserStatus(this, '<?php echo htmlspecialchars($user['id']); ?>', 'Suspended')" class="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-3 rounded-md shadow-sm transition-colors">Activate</a>
                                    <?php else: // Pending Approval or other statuses ?>
                                        <a href="#" onclick="toggleUserStatus(this, '<?php echo htmlspecialchars($user['id']); ?>', '<?php echo htmlspecialchars($user['status']); ?>')" class="bg-gray-400 hover:bg-gray-500 text-white text-xs font-medium py-1 px-3 rounded-md shadow-sm transition-colors">Manage</a>
                                    <?php endif; ?>
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
                    Showing <span class="font-medium">1</span> to <span class="font-medium"><?php echo count($users); ?></span> of <span class="font-medium"><?php echo count($users); ?></span> results (Demo)
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
    function toggleUserStatus(buttonElement, userId, currentStatus) {
        const currentStatusLower = currentStatus.toLowerCase();
        let action, newStatus, confirmationMessage;

        if (currentStatusLower === 'active') {
            action = 'suspend';
            newStatus = 'Suspended';
        } else if (currentStatusLower === 'suspended') {
            action = 'activate';
            newStatus = 'Active';
        } else { // For 'Pending Approval' or other statuses, default to an approval/activation flow for demo
            action = 'approve';
            newStatus = 'Active'; 
        }
        confirmationMessage = `Are you sure you want to ${action} user ${userId}? (Demo only)`;

        if (confirm(confirmationMessage)) {
            const row = buttonElement.closest('tr');
            const statusCell = row.querySelector('td:nth-child(7) span'); // 7th column for Status
            
            statusCell.textContent = newStatus;
            statusCell.className = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' + getUserStatusBadgeClassJS(newStatus);

            // Update button text and action
            if (newStatus === 'Active') {
                buttonElement.textContent = 'Suspend';
                buttonElement.className = 'bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium py-1 px-3 rounded-md shadow-sm transition-colors';
                buttonElement.setAttribute('onclick', `toggleUserStatus(this, '${userId}', 'Active')`);
            } else if (newStatus === 'Suspended') {
                buttonElement.textContent = 'Activate';
                buttonElement.className = 'bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-3 rounded-md shadow-sm transition-colors';
                buttonElement.setAttribute('onclick', `toggleUserStatus(this, '${userId}', 'Suspended')`);
            } else {
                 // If it was 'Pending Approval' and became 'Active', set button to 'Suspend'
                buttonElement.textContent = 'Suspend';
                buttonElement.className = 'bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium py-1 px-3 rounded-md shadow-sm transition-colors';
                buttonElement.setAttribute('onclick', `toggleUser_status(this, '${userId}', 'Active')`);
            }
            console.log(`User ${userId} status visually changed to ${newStatus}.`);
        }
    }

    // JS helper for badge class - mirrors PHP function
    function getUserStatusBadgeClassJS(status) {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            case 'pending approval': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
    </script>
</body>
</html>
