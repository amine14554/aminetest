import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  profiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    displayName: v.string(),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    followers: v.number(),
    following: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"]),

  friendships: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    status: v.string(), // "pending" | "accepted"
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"]),

  messages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
    timestamp: v.number(),
  })
    .index("by_participants", ["senderId", "receiverId"])
    .index("by_timestamp", ["timestamp"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
