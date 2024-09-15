import { query } from "./_generated/server";

export const mostRecentImageUrl = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    const imageList = await Promise.all(
      messages.map(async (message) => ({
        ...message,
        // If the message is an "image" its `body` is an `Id<"_storage">`
        ...(message.format === "image"
          ? { url: await ctx.storage.getUrl(message.body) }
          : {}),
      })),
    );
    const urlList = imageList.map((image) => image.url);
    // const urlList = imageList.map((image) => image[2]);
    return await ctx.storage.getUrl('kg23850y52d9tw02qb3bwzkn7s70v88r');
  },
  });

