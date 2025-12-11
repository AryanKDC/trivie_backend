
const verifyCategory = async () => {
    const baseUrl = "http://127.0.0.1:2002/api/v1/category";
    const rootUrl = "http://127.0.0.1:2002";
    let categoryId = "";

    console.log("Starting Category Verification...");

    // 0. Health Check
    try {
        const res = await fetch(rootUrl);
        const text = await res.text();
        console.log("Health Check:", text);
    } catch (e) {
        console.error("Health Check Failed:", e);
        return;
    }

    // 1. Create Category
    console.log("\n1. Testing Create Category...");
    try {
        const response = await fetch(`${baseUrl}/add-category`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Category " + Date.now(),
                description: "This is a test category",
            }),
        });
        const data = await response.json();
        console.log("Create Response:", data);
        if (data.status) {
            categoryId = data.data._id;
            console.log("Category Created with ID:", categoryId);
        } else {
            console.error("Failed to create category");
            return;
        }
    } catch (error) {
        console.error("Error creating category:", error);
        return;
    }

    // 2. Get All Categories (with Pagination)
    console.log("\n2. Testing Get All Categories (Pagination)...");
    try {
        const response = await fetch(`${baseUrl}/get?page=1&limit=5`);
        const data = await response.json();
        console.log("Get All Response Status:", data.status);
        console.log("Number of categories:", data.data.length);
        console.log("Pagination:", data.pagination);
    } catch (error) {
        console.error("Error getting categories:", error);
    }

    // 3. Get Category By ID
    if (categoryId) {
        console.log(`\n3. Testing Get Category By ID (${categoryId})...`);
        try {
            const response = await fetch(`${baseUrl}/get/${categoryId}`);
            const data = await response.json();
            console.log("Get By ID Response:", data);
        } catch (error) {
            console.error("Error getting category by ID:", error);
        }
    }

    // 4. Update Category
    if (categoryId) {
        console.log(`\n4. Testing Update Category (${categoryId})...`);
        try {
            const response = await fetch(`${baseUrl}/update/${categoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: "Updated description",
                }),
            });
            const data = await response.json();
            console.log("Update Response:", data);
        } catch (error) {
            console.error("Error updating category:", error);
        }
    }

    // 5. Delete Category
    if (categoryId) {
        console.log(`\n5. Testing Delete Category (${categoryId})...`);
        try {
            const response = await fetch(`${baseUrl}/delete/${categoryId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            console.log("Delete Response:", data);
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    }

    console.log("\nVerification Complete.");
};

verifyCategory();
