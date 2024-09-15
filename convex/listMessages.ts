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
    console.log("hi");
    console.log("imageList[0] id: " + imageList[0].id);
    const urlList = imageList.map((image) => image.url);
    // const urlList = imageList.map((image) => image[2]);
    return urlList[0];
  },
  });

