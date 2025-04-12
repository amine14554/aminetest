import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const sendFriendRequest = mutation({
  args: { receiverId: v.id("users") },
  handler: async (ctx, args) => {
    const senderId = await getAuthUserId(ctx);
    if (!senderId) throw new Error("Not authenticated");
    if (senderId === args.receiverId) throw new Error("Cannot friend yourself");

    const existing = await ctx.db
      .query("friendships")
      .withIndex("by_sender", (q) => q.eq("senderId", senderId))
      .filter((q) => q.eq(q.field("receiverId"), args.receiverId))
      .unique();
    if (existing) throw new Error("Friend request already sent");

    await ctx.db.insert("friendships", {
      senderId,
      receiverId: args.receiverId,
      status: "pending",
    });
  },
});

export const acceptFriendRequest = mutation({
  args: { senderId: v.id("users") },
  handler: async (ctx, args) => {
    const receiverId = await getAuthUserId(ctx);
    if (!receiverId) throw new Error("Not authenticated");

    const request = await ctx.db
      .query("friendships")
      .withIndex("by_sender", (q) => q.eq("senderId", args.senderId))
      .filter((q) => q.eq(q.field("receiverId"), receiverId))
      .unique();
    if (!request) throw new Error("Friend request not found");

    await ctx.db.patch(request._id, { status: "accepted" });
  },
});

export const getFriends = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const friends = await ctx.db
      .query("friendships")
      .withIndex("by_sender", (q) => q.eq("senderId", userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    return Promise.all(
      friends.map(async (friend) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", friend.receiverId))
          .unique();
        return profile;
      })
    );
  },
});
