
// Base URL for the API
const BASE_URL = "http://localhost:2000/api/v1/user";

// User data for testing
const testUser = {
    user_name: "testuser_" + Date.now(),
    password: "password123",
    email: `test_${Date.now()}@example.com`,
    role_id: "user"
};

const runTests = async () => {
    let createdUserId = null;

    console.log("Starting User API Verification...");

    // Helper for fetch requests
    const request = async (url, method, body = null) => {
        const options = {
            method,
            headers: { "Content-Type": "application/json" },
        };
        if (body) options.body = JSON.stringify(body);
        const res = await fetch(url, options);
        let data = null;
        try {
            const text = await res.text();
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("❌ Failed to parse JSON. Raw response:", text);
            }
        } catch (e) {
            console.error("❌ Failed to read response text.", e);
        }
        return { status: res.status, data };
    };

    // 1. Test Add User
    try {
        console.log("\n[TEST] Adding new user...");
        const res = await request(BASE_URL, "POST", testUser);
        if ((res.status === 200 || res.status === 201) && res.data && res.data.status && res.data.data) {
            console.log("✅ Passed: User added successfully.");
            createdUserId = res.data.data._id;
        } else {
            console.error("❌ Failed: Add user response invalid.", JSON.stringify(res.data, null, 2));
            return;
        }
    } catch (error) {
        console.error("❌ Failed: Error adding user.", error.message);
        return;
    }

    // 2. Test Get Users
    try {
        console.log("\n[TEST] Fetching users list...");
        const res = await request(BASE_URL, "GET");
        if (res.status === 200 && res.data && res.data.status && Array.isArray(res.data.data)) {
            const found = res.data.data.find(u => u._id === createdUserId);
            if (found) {
                console.log("✅ Passed: Users fetched and new user found in list.");
            } else {
                console.warn("⚠️ Warning: Users fetched but new user not found in the first page (might be expected if many users).");
            }
        } else {
            console.error("❌ Failed: Get users response invalid.", res.data);
        }
    } catch (error) {
        console.error("❌ Failed: Error fetching users.", error.message);
    }

    // 3. Test Get User By ID
    try {
        console.log(`\n[TEST] Fetching user by ID (${createdUserId})...`);
        const res = await request(`${BASE_URL}/${createdUserId}`, "GET");
        if (res.status === 200 && res.data && res.data.status && res.data.data._id === createdUserId) {
            console.log("✅ Passed: User fetched by ID successfully.");
        } else {
            console.error("❌ Failed: Get user by ID response invalid.", res.data);
        }
    } catch (error) {
        console.error("❌ Failed: Error fetching user by ID.", error.message);
    }

    // 4. Test Update User
    try {
        console.log(`\n[TEST] Updating user (${createdUserId})...`);
        const updateData = { user_name: "testuser_updated_" + Date.now() };
        const res = await request(`${BASE_URL}/${createdUserId}`, "PUT", updateData);
        if (res.status === 200 && res.data && res.data.status && res.data.data.user_name.startsWith("testuser_updated_")) {
            console.log("✅ Passed: User updated successfully.");
        } else {
            console.error("❌ Failed: Update user response invalid.", res.data);
        }
    } catch (error) {
        console.error("❌ Failed: Error updating user.", error.message);
    }

    // 5. Test Delete User
    try {
        console.log(`\n[TEST] Deleting user (${createdUserId})...`);
        const res = await request(`${BASE_URL}/${createdUserId}`, "DELETE");
        if (res.status === 200 && res.data && res.data.status) {
            console.log("✅ Passed: User deleted successfully.");
        } else {
            console.error("❌ Failed: Delete user response invalid.", res.data);
        }
    } catch (error) {
        console.error("❌ Failed: Error deleting user.", error.message);
    }

    // 6. Verify Deletion
    try {
        console.log(`\n[TEST] Verifying deletion (fetching ${createdUserId})...`);
        const res = await request(`${BASE_URL}/${createdUserId}`, "GET");
        if (res.status === 404) {
            console.log("✅ Passed: User not found (as expected).");
        } else {
            console.error("❌ Failed: User should have been deleted but was found or error was not 404.", res);
        }
    } catch (error) {
        console.error("❌ Failed: Unexpected error when verifying deletion.", error.message);
    }
};

runTests();
