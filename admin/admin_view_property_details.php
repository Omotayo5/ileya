<?php
require_once 'auth_check.php';
require_once 'properties_data.php';

$property_id = $_GET['id'] ?? null;
$property = null;
$all_properties = get_demo_properties_data();

if ($property_id) {
    foreach ($all_properties as $p) {
        if ($p['id'] == $property_id) {
            $property = $p;
            break;
        }
    }
}

// Status color mapping
$status_colors = [
    'Active' => 'bg-green-100 text-green-800',
    'Rented' => 'bg-blue-100 text-blue-800',
    'Pending Approval' => 'bg-yellow-100 text-yellow-800',
    'Unavailable' => 'bg-gray-100 text-gray-800',
    'Draft' => 'bg-indigo-100 text-indigo-800'
];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Property Details - Ileya Admin</title>
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
        <?php if ($property): ?>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-semibold text-gray-800">Property Details (ID: <?php echo htmlspecialchars($property['id']); ?>)</h1>
            <a href="admin_properties.php" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">
                &larr; Back to Properties
            </a>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold text-gray-700 mb-4"><?php echo htmlspecialchars($property['title']); ?></h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-600 mb-1">Address:</h3>
                    <p class="text-gray-800"><?php echo htmlspecialchars($property['address']); ?></p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-600 mb-1">Listed By:</h3>
                    <p class="text-gray-800"><?php echo htmlspecialchars($property['landlord_email']); ?> (ID: <?php echo htmlspecialchars($property['landlord_id']); ?>)</p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-600 mb-1">Rent per Month:</h3>
                    <p class="text-gray-800">$<?php echo htmlspecialchars(number_format($property['rent_per_month'], 2)); ?></p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-600 mb-1">Status:</h3>
                    <p class="text-gray-800"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full <?php echo $status_colors[$property['status']] ?? 'bg-gray-100 text-gray-800'; ?>"><?php echo htmlspecialchars($property['status']); ?></span></p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-600 mb-1">Date Listed:</h3>
                    <p class="text-gray-800"><?php echo htmlspecialchars($property['date_listed']); ?></p>
                </div>
            </div>

            <div class="mt-6">
                <h3 class="text-lg font-semibold text-gray-600 mb-1">Description:</h3>
                <p class="text-gray-800"><?php echo nl2br(htmlspecialchars($property['description'] ?? 'No description available.')); ?></p>
            </div>

            <div class="mt-6">
                <h3 class="text-lg font-semibold text-gray-600 mb-2">Images:</h3>
                <?php if (!empty($property['images']) && is_array($property['images'])): ?>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <?php foreach ($property['images'] as $index => $image_url): ?>
                            <div class="bg-gray-200 h-48 rounded flex items-center justify-center text-gray-500 overflow-hidden">
                                <img src="<?php echo htmlspecialchars($image_url); ?>" alt="Property Image <?php echo $index + 1; ?>" class="object-cover w-full h-full">
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <p class="text-gray-500">No images available for this property.</p>
                <?php endif; ?>
            </div>

            <div class="mt-8 border-t pt-6 flex justify-end space-x-3">
                <button onclick="alert('Unlist Property (ID: <?php echo htmlspecialchars($property['id']); ?>) - backend action pending.')" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors">Unlist Property</button>
                <!-- Placeholder for Edit Property button -->
                 <a href="admin_edit_property.php?id=<?php echo htmlspecialchars($property['id']); ?>" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors">Edit Property</a>
            </div>
        </div>
        <?php else: ?>
        <div class="bg-white p-6 rounded-lg shadow-md text-center">
            <h1 class="text-2xl font-semibold text-red-600 mb-4">Property Not Found</h1>
            <p class="text-gray-600 mb-6">The property with ID '<?php echo htmlspecialchars($property_id); ?>' could not be found or is not available.</p>
            <a href="admin_properties.php" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm transition-colors">
                Return to Properties List
            </a>
        </div>
        <?php endif; ?>
    </div>

    <script src="../js/main.js"></script>
</body>
</html>
