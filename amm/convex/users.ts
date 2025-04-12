import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createProfile = mutation({
  args: {
    username: v.string(),
    displayName: v.string(),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if username is unique
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();
    if (existing) throw new Error("Username already taken");

    return await ctx.db.insert("profiles", {
      userId,
      username: args.username,
      displayName: args.displayName,
      bio: args.bio,
      avatarUrl: args.avatarUrl,
      followers: 0,
      following: 0,
    });
  },
});

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const updateProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) throw new Error("Profile not found");

    const updates: {
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
      username?: string;
    } = {};

    if (typeof args.username === "string") {
      // Only check for username uniqueness if it's being updated
      const username = args.username; // Create a new variable to help TypeScript
      const existing = await ctx.db
        .query("profiles")
        .withIndex("by_username", (q) => q.eq("username", username))
        .unique();
      if (existing && existing._id !== profile._id) {
        throw new Error("Username already taken");
      }
      updates.username = username;
    }

    if (typeof args.displayName === "string") updates.displayName = args.displayName;
    if (typeof args.bio === "string") updates.bio = args.bio;
    if (typeof args.avatarUrl === "string") updates.avatarUrl = args.avatarUrl;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(profile._id, updates);
    }
  },
});
