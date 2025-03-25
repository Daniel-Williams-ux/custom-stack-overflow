import { Permission, IndexType } from "node-appwrite";
import { commentCollection, db } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
    // create collection
    await databases.createCollection(db, commentCollection, commentCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users")
    ]);
    console.log("✅ Comment collection is created");

    // creating attributes and indexes
    await Promise.all([
        databases.createStringAttribute(db, commentCollection, "content", 10000, true), // Comment text
        databases.createEnumAttribute(db, commentCollection, "type", ["answer", "question"], true), // Type of parent (question/answer)
        databases.createStringAttribute(db, commentCollection, "authorId", 50, true), // User who posted the comment
        databases.createStringAttribute(db, commentCollection, "typeId", 50, true), // ID of the question or answer being commented on
    ]);
    console.log("✅ Comment attributes created");

    // create indexes
    await Promise.all([
        databases.createIndex(
            db,
            commentCollection,
            "content",
            IndexType.Fulltext,
            ["content"],
            ["asc"]
        ),
        databases.createIndex(
            db,
            commentCollection,
            "typeId",
            IndexType.Key,
            ["typeId"],
            ["asc"]
        )
    ]);
    console.log("✅ Comment indexes created successfully");
}