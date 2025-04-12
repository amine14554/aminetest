import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const sendMessage = mutation({
  args: {
    receiverId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const senderId = await getAuthUserId(ctx);
    if (!senderId) throw new Error("Not authenticated");

    // Check if they are friends
    const friendship = await ctx.db
      .query("friendships")
      .withIndex("by_sender", (q) => q.eq("senderId", senderId))
      .filter((q) => 
        q.and(
          q.eq(q.field("receiverId"), args.receiverId),
          q.eq(q.field("status"), "accepted")
        )
      )
      .unique();
    if (!friendship) throw new Error("Must be friends to send messages");

    await ctx.db.insert("messages", {
      senderId,
      receiverId: args.receiverId,
      content: args.content,
      timestamp: Date.now(),
    });
  },
});

export const getMessages = query({
  args: { otherId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_participants", (q) => q.eq("senderId", userId))
      .filter((q) => q.eq(q.field("receiverId"), args.otherId))
      .collect();

    const otherMessages = await ctx.db
      .query("messages")
      .withIndex("by_participants", (q) => q.eq("senderId", args.otherId))
      .filter((q) => q.eq(q.field("receiverId"), userId))
      .collect();

    return [...messages, ...otherMessages].sort((a, b) => a.timestamp - b.timestamp);
  },
});
