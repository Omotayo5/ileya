<?php require_once 'auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Settings - Ileya Admin</title>
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
                <a href="admin_settings.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold">Settings</a>
                <a href="admin_logout.php" class="px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Logout</a>
            </div>
        </div>
    </nav>

    <!-- Main Admin Content -->
    <div class="container mx-auto mt-8 p-4">
        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Admin Settings</h1>

        <form id="settingsForm">
            <!-- Rental Management Settings (Retained) -->
            <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Rental Management Settings</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label for="defaultListingDuration" class="block text-sm font-medium text-gray-700">Default Listing Duration (days)</label>
                        <input type="number" name="defaultListingDuration" id="defaultListingDuration" value="30" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="maxImagesPerListing" class="block text-sm font-medium text-gray-700">Maximum Images per Listing</label>
                        <input type="number" name="maxImagesPerListing" id="maxImagesPerListing" value="10" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label for="autoApproveListings" class="block text-sm font-medium text-gray-700">Automatically Approve New Listings</label>
                        <select name="autoApproveListings" id="autoApproveListings" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                            <option value="no" selected>No (Manual Approval Required)</option>
                            <option value="yes">Yes (Approve Automatically)</option>
                        </select>
                    </div>
                    <div>
                        <label for="notificationEmail" class="block text-sm font-medium text-gray-700">Admin Notification Email for New Listings</label>
                        <input type="email" name="notificationEmail" id="notificationEmail" value="admin@ileya.com" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                    </div>
                </div>

            </div>

            <!-- Admin Users & Permissions -->
            <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                <div class="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 class="text-xl font-semibold text-gray-700">Admin Users & Permissions</h2>
                    <button type="button" onclick="openAddAdminModal()" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors">
                        Add New Admin User
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <!-- Sample Admin User Row 1 -->
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ADM001</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Main Admin</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">admin@ileya.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Super Admin</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button type="button" onclick="openEditPermissionsModal('ADM001', 'Main Admin', 'Super Admin')" class="text-blue-600 hover:text-blue-900 mr-3">Edit Permissions</button>
                                    <button type="button" onclick="toggleAdminStatus(this, 'ADM001', 'Active')" class="text-red-600 hover:text-red-900">Deactivate</button>
                                </td>
                            </tr>
                            <!-- Sample Admin User Row 2 -->
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ADM002</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Support Staff</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">support@ileya.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Customer Care</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button type="button" onclick="openEditPermissionsModal('ADM002', 'Support Staff', 'Customer Care')" class="text-blue-600 hover:text-blue-900 mr-3">Edit Permissions</button>
                                    <button type="button" onclick="toggleAdminStatus(this, 'ADM002', 'Active')" class="text-red-600 hover:text-red-900">Deactivate</button>
                                </td>
                            </tr>
                            <!-- Sample Admin User Row 3 -->
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ADM003</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Finance Team</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">finance@ileya.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Accountant</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                        Inactive
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button type="button" onclick="openEditPermissionsModal('ADM003', 'Finance Team', 'Accountant')" class="text-blue-600 hover:text-blue-900 mr-3">Edit Permissions</button>
                                    <button type="button" onclick="toggleAdminStatus(this, 'ADM003', 'Inactive')" class="text-green-600 hover:text-green-900">Activate</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Save Button -->
            <div class="flex justify-end">
                <button type="button" onclick="alert('Settings saved (simulation).')" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Save Settings
                </button>
            </div>
        </form>

    <!-- Add Admin User Modal -->
    <div id="addAdminModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" style="display: none;">
        <div class="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div class="mt-3 text-center">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Admin User</h3>
                <form id="addAdminForm" class="space-y-4">
                    <div>
                        <label for="newAdminName" class="sr-only">Full Name</label>
                        <input type="text" name="newAdminName" id="newAdminName" placeholder="Full Name" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="newAdminEmail" class="sr-only">Email Address</label>
                        <input type="email" name="newAdminEmail" id="newAdminEmail" placeholder="Email Address" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="newAdminRole" class="sr-only">Role</label>
                        <select name="newAdminRole" id="newAdminRole" required class="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                            <option value="" disabled selected>Select Role</option>
                            <option value="Customer Care">Customer Care</option>
                            <option value="Accountant">Accountant</option>
                            <option value="Content Moderator">Content Moderator</option>
                            <option value="Technical Support">Technical Support</option>
                        </select>
                    </div>
                    <div>
                        <label for="newAdminPassword" class="sr-only">Temporary Password</label>
                        <input type="password" name="newAdminPassword" id="newAdminPassword" placeholder="Temporary Password" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                    </div>
                    <div class="items-center gap-2 mt-3 sm:flex">
                        <button type="submit" class="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2 hover:bg-red-700">
                            Add Admin User
                        </button>
                        <button type="button" onclick="closeAddAdminModal()" class="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2 hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Permissions Modal -->
    <div id="editPermissionsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" style="display: none;">
        <div class="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">Edit Permissions for <span id="permAdminName" class="font-semibold">[Admin Name]</span> (<span id="permAdminId" class="text-sm text-gray-600">[ID]</span>)</h3>
                <p class="text-sm text-gray-500 mb-4">Current Role: <span id="permAdminRole" class="font-semibold">[Role]</span></p>
                
                <form id="editPermissionsForm" class="space-y-4">
                    <p class="text-sm font-medium text-gray-700">Assign Permissions:</p>
                    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                            <input type="checkbox" id="permManageUsers" name="permissions[]" value="manage_users" class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
                            <label for="permManageUsers" class="ml-2 text-sm text-gray-700">Manage Users</label>
                        </div>
                        <div>
                            <input type="checkbox" id="permManageProperties" name="permissions[]" value="manage_properties" class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
                            <label for="permManageProperties" class="ml-2 text-sm text-gray-700">Manage Properties</label>
                        </div>
                        <div>
                            <input type="checkbox" id="permViewReports" name="permissions[]" value="view_reports" class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
                            <label for="permViewReports" class="ml-2 text-sm text-gray-700">View Reports</label>
                        </div>
                        <div>
                            <input type="checkbox" id="permManageSettings" name="permissions[]" value="manage_settings" class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
                            <label for="permManageSettings" class="ml-2 text-sm text-gray-700">Manage Site Settings</label>
                        </div>
                        <div>
                            <input type="checkbox" id="permModerateContent" name="permissions[]" value="moderate_content" class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
                            <label for="permModerateContent" class="ml-2 text-sm text-gray-700">Moderate Content</label>
                        </div>
                        <div>
                            <input type="checkbox" id="permAccessLogs" name="permissions[]" value="access_logs" class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
                            <label for="permAccessLogs" class="ml-2 text-sm text-gray-700">Access System Logs</label>
                        </div>
                    </div>

                    <div class="items-center gap-2 mt-4 pt-4 border-t sm:flex">
                        <button type="button" onclick="savePermissions()" class="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2 hover:bg-red-700">
                            Save Permissions
                        </button>
                        <button type="button" onclick="closeEditPermissionsModal()" class="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2 hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    </div>

    <script src="../js/main.js"></script>
    <script>
    // Modal handling for Add Admin User
    function openAddAdminModal() {
        document.getElementById('addAdminModal').style.display = 'flex';
    }
    function closeAddAdminModal() {
        document.getElementById('addAdminModal').style.display = 'none';
        document.getElementById('addAdminForm').reset();
    }

    document.getElementById('addAdminForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('newAdminName').value;
        const email = document.getElementById('newAdminEmail').value;
        // In a real app, you would send this data to a backend to create the user.
        alert(`Simulating: Adding admin user ${name} (${email}).`);
        closeAddAdminModal();
    });

    // Function to toggle admin user status (Activate/Deactivate)
    function toggleAdminStatus(buttonElement, adminId, currentStatus) {
        // Prevent deactivating the main admin (ADM001) for safety in demo
        if (adminId === 'ADM001' && currentStatus === 'Active') {
            alert('Deactivating the main Super Admin is not allowed in this demo.');
            return;
        }

        const action = currentStatus === 'Active' ? 'deactivate' : 'activate';
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        const confirmationMessage = `Are you sure you want to ${action} admin user ${adminId}?`;

        if (confirm(confirmationMessage)) {
            const row = buttonElement.closest('tr');
            const statusCell = row.querySelector('td:nth-child(5) span'); // 5th column is Status

            if (newStatus === 'Active') {
                statusCell.textContent = 'Active';
                statusCell.classList.remove('bg-red-100', 'text-red-800');
                statusCell.classList.add('bg-green-100', 'text-green-800');
                buttonElement.textContent = 'Deactivate';
                buttonElement.classList.remove('text-green-600', 'hover:text-green-900');
                buttonElement.classList.add('text-red-600', 'hover:text-red-900');
                buttonElement.setAttribute('onclick', `toggleAdminStatus(this, '${adminId}', 'Active')`);
            } else { // Inactive
                statusCell.textContent = 'Inactive';
                statusCell.classList.remove('bg-green-100', 'text-green-800');
                statusCell.classList.add('bg-red-100', 'text-red-800');
                buttonElement.textContent = 'Activate';
                buttonElement.classList.remove('text-red-600', 'hover:text-red-900');
                buttonElement.classList.add('text-green-600', 'hover:text-green-900');
                buttonElement.setAttribute('onclick', `toggleAdminStatus(this, '${adminId}', 'Inactive')`);
            }
            console.log(`Admin user ${adminId} status changed to ${newStatus}`);
            // In a real application, this update would be sent to the backend.
        }
    }

    let currentEditingAdminId = null;

    function openEditPermissionsModal(adminId, adminName, adminRole) {
        currentEditingAdminId = adminId;
        document.getElementById('permAdminId').textContent = adminId;
        document.getElementById('permAdminName').textContent = adminName;
        document.getElementById('permAdminRole').textContent = adminRole;

        // Reset all checkboxes
        const checkboxes = document.querySelectorAll('#editPermissionsForm input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
            cb.disabled = false;
        });

        // Set permissions based on role (simplified logic)
        if (adminRole === 'Super Admin') {
            checkboxes.forEach(cb => {
                cb.checked = true;
                cb.disabled = true; // Super admin has all permissions, non-editable
            });
        } else if (adminRole === 'Customer Care') {
            document.getElementById('permManageUsers').checked = true;
            document.getElementById('permManageProperties').checked = true;
        } else if (adminRole === 'Accountant') {
            document.getElementById('permViewReports').checked = true;
            document.getElementById('permManageSettings').checked = true; // Example: Accountants might manage certain financial settings
        }
        // For other roles or more granular control, expand this logic

        document.getElementById('editPermissionsModal').style.display = 'flex';
    }

    function closeEditPermissionsModal() {
        document.getElementById('editPermissionsModal').style.display = 'none';
        currentEditingAdminId = null;
    }

    function savePermissions() {
        if (!currentEditingAdminId) return;

        const selectedPermissions = [];
        document.querySelectorAll('#editPermissionsForm input[type="checkbox"]:checked').forEach(cb => {
            selectedPermissions.push(cb.value);
        });

        alert(`Simulating: Permissions saved for ${currentEditingAdminId}:\n${selectedPermissions.join(', ')}`);
        // In a real app, you'd send this data to a backend.
        closeEditPermissionsModal();
    }
</script>
</body>
</html>
