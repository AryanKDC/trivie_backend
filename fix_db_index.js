import mongoose from "mongoose";
import getConfigs from "./config.js";

const configs = getConfigs();

const dropIndex = async () => {
    try {
        await mongoose.connect(configs.mongo.url);
        console.log("Connected to MongoDB.");

        const collection = mongoose.connection.collection("users");
        const indexes = await collection.indexes();
        console.log("Existing indexes:", indexes);

        const phoneIndex = indexes.find(idx => idx.name === "phone_1");
        if (phoneIndex) {
            await collection.dropIndex("phone_1");
            console.log("✅ Dropped index 'phone_1'.");
        } else {
            console.log("Index 'phone_1' not found.");
        }

        process.exit();
    } catch (error) {
        console.error("❌ Error dropping index:", error);
        process.exit(1);
    }
};

dropIndex();
