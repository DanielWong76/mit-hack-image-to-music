import { query } from "./_generated/server";

export const mostRecentImageUrl = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("desc").first();
    const url = await ctx.storage.getUrl(messages.body);
    return url;
  },
  });

