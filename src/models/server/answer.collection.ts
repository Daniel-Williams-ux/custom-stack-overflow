import {IndexType, Permission} from "node-appwrite"

import { db, answerCollection } from "../name"
import { databases } from "./config"
import { log } from "console"

export default async function createAnswerCollection() {
    // create collection
    await databases.createCollection(db, answerCollection, answerCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users")
    ])
    console.log("Answer collection is created")

    // creating attributes and indexes
    await Promise.all([
    databases.createStringAttribute(db, answerCollection, "content", 10000, true),  // Answer text
    databases.createStringAttribute(db, answerCollection, "authorId", 50, true),   // User who posted the answer
    databases.createStringAttribute(db, answerCollection, "questionId", 50, true), // Links to a question
    databases.createStringAttribute(db, answerCollection, "attachmentId", 50, false), // Optional attachments
])

    console.log("Answer Attributes Created")

    // crate index
    await Promise.all([
    databases.createIndex(
        db,
        answerCollection,
        "content",
        IndexType.Fulltext,
        ["content"],
        ["asc"]
    ),
    databases.createIndex(
        db,
        answerCollection,
        "questionId",
        IndexType.Key,
        ["questionId"],
        ["asc"]
    )
    ])
    console.log("✅ Anser Indexes Created");
}