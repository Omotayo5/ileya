<?php
require_once 'auth_check.php';
require_once 'users_data.php';

$user_id = $_GET['id'] ?? null;
$user = null;
$all_users = get_demo_users_data();

if ($user_id) {
    foreach ($all_users as $u) {
        if ($u['id'] == $user_id) {
            $user = $u;
            break;
        }
    }
}

// Status color mapping for users
$status_colors = [
    'Active' => 'bg-green-100 text-green-800',
    'Suspended' => 'bg-red-100 text-red-800',
    'Pending Approval' => 'bg-yellow-100 text-yellow-800',
    'Deactivated' => 'bg-gray-100 text-gray-800'
];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View User Details - Ileya Admin</title>
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
        <h1 id="pageTitle" class="text-3xl font-semibold text-gray-800 mb-6">
            User Details: <?php echo $user ? htmlspecialchars($user['name']) . ' (ID: ' . htmlspecialchars($user['id']) . ')' : 'User Not Found'; ?>
        </h1>

        <?php if ($user): ?>
        <div id="userDetailsContent" class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-6">
                <?php if (!empty($user['profile_image_url'])): ?>
                    <img src="<?php echo htmlspecialchars($user['profile_image_url']); ?>" alt="Profile image of <?php echo htmlspecialchars($user['name']); ?>" class="w-24 h-24 rounded-full mr-6 object-cover">
                <?php else: ?>
                    <div class="w-24 h-24 rounded-full mr-6 bg-gray-300 flex items-center justify-center text-gray-500 text-3xl">
                        <?php echo strtoupper(substr($user['name'], 0, 1)); ?>
                    </div>
                <?php endif; ?>
                <div>
                    <h2 class="text-2xl font-semibold text-gray-700"><?php echo htmlspecialchars($user['name']); ?></h2>
                    <p class="text-gray-500"><?php echo htmlspecialchars($user['role']); ?></p>
                </div>
            </div>
            
            <h3 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">User Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <p class="text-sm font-medium text-gray-500">User ID:</p>
                    <p class="text-lg text-gray-800"><?php echo htmlspecialchars($user['id']); ?></p>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Email Address:</p>
                    <p class="text-lg text-gray-800"><?php echo htmlspecialchars($user['email']); ?></p>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Date Registered:</p>
                    <p class="text-lg text-gray-800"><?php echo htmlspecialchars($user['registration_date']); ?></p>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Number of Listings:</p>
                    <p class="text-lg text-gray-800"><?php echo htmlspecialchars($user['listings_count']); ?></p>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Account Status:</p>
                    <p class="text-lg text-gray-800"><span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full <?php echo $status_colors[$user['status']] ?? 'bg-gray-200 text-gray-800'; ?>"><?php echo htmlspecialchars($user['status']); ?></span></p>
                </div>
            </div>

            <h3 class="text-xl font-semibold text-gray-700 mb-2 border-b pb-2">User Activity (Demo)</h3>
            <ul class="list-disc list-inside text-gray-600 space-y-1">
                <li>Logged in on <?php echo date('Y-m-d', strtotime('-2 days')); ?></li>
                <?php if ($user['listings_count'] > 0): ?>
                <li>Last listed a property on <?php echo date('Y-m-d', strtotime('-5 days')); ?> (Demo)</li>
                <?php endif; ?>
                <li>Profile last updated on <?php echo date('Y-m-d', strtotime('-10 days')); ?> (Demo)</li>
            </ul>

            <div class="mt-8 border-t pt-6 flex justify-between items-center">
                <a href="admin_users.php" class="text-red-600 hover:text-red-700 hover:underline transition-colors duration-150">&larr; Back to All Users</a>
                <div>
                    <!-- Placeholder for Edit User button -->
                    <a href="admin_edit_user.php?id=<?php echo htmlspecialchars($user['id']); ?>" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors mr-2">Edit User</a>
                    <button onclick="alert('Action (e.g., Suspend User <?php echo htmlspecialchars($user['id']); ?>) - backend pending.')" class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors">Take Action</button>
                </div>
            </div>
        </div>
        <?php else: ?>
        <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 class="text-2xl font-semibold text-red-600 mb-4">User Not Found</h2>
            <p class="text-gray-600 mb-6">The user with ID '<?php echo htmlspecialchars($user_id); ?>' could not be found.</p>
            <a href="admin_users.php" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm transition-colors">
                Return to Users List
            </a>
        </div>
        <?php endif; ?>
    </div>
    <script src="../js/main.js"></script>
</body>
</html>
