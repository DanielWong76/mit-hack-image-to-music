import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query function:
export const listIdeas = query({
  // Validators for arguments.
  args: {},

  // Query function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    return await ctx.db.query("ideas").collect();
  },
});

// You can write data to the database via a mutation function:
export const saveIdea = mutation({
  // Validators for arguments.
  args: {
    idea: v.string(),
    random: v.boolean(),
  },

  // Mutation function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.

    // Optionally, capture the ID of the newly created document
    const id = await ctx.db.insert("ideas", args);

    // Optionally, return a value from your mutation.
    return id;
  },
});


// You can fetch data from and send data to third-party APIs via an action:
export const fetchRandomIdea = action({
  // Validators for arguments.
  args: {},

  // Action implementation.
  handler: async (ctx) => {
    // Use the browser-like `fetch` API to send HTTP requests.
    // See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
    const response = await fetch("https://appideagenerator.com/call.php");
    const idea = await response.text();

    // Write or query data by running Convex mutations/queries from within an action
    await ctx.runMutation(api.myFunctions.saveIdea, {
      idea: idea.trim(),
      random: true,
    });

    // Optionally, return a value from your action
    return idea;
  },
});

interface PostData{
  image_url: string;
  question: string;
}



// You can fetch data from and send data to third-party APIs via an action:
export const fetchModalResponse = action({
  // Validators for arguments.
  args: { 
    imageUrl: v.string()
  },

  // Action implementation.
  handler: async (ctx, { imageUrl }) => {
    // Use the browser-like `fetch` API to send HTTP requests.
    // See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
    const url = "https://baseballwalkerchris--example-sgl-vlm-model-generate-dev.modal.run";
    const requestData: PostData = {
      "image_url": imageUrl,
      "question": "What is in this image?"   
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });
    const imageDescription = await response.text();

    // Write or query data by running Convex mutations/queries from within an action
    // await ctx.runMutation(api.myFunctions.saveIdea, {
    //   idea: idea.trim(),
    //   random: true,
    // });

    // Optionally, return a value from your action
    return imageDescription;
  },
});

// writing an image to the DB via a mutation function
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export async function postToSuno(songDetails: any) {
  try {
    console.log("a");
    console.log(songDetails);
    // Send a POST request
    const response = await fetch("https://studio-api.suno.ai/api/external/generate/", {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
        "Authorization": "Bearer mCa8TXTHJJ71y5V0eIDrTcwkC7EQiO2V",
      },
      body: JSON.stringify(songDetails), // Convert data object to a JSON string
    });
    console.log("b");

    // Check if the response is successful (status code 2xx)
    if (!response.ok) {
      throw new Error(`Error from suno: ${response.statusText}`);
    }

    // Parse the response JSON
    const responseData = await response.json();

    // Log or return the ID from the response
    console.log("Response ID:", responseData.id);
    return responseData.id; // Assuming 'id' exists in the response JSON
  } catch (error) {
    console.error("Error posting to API:", error);
  }
}

// run get from suno as an action:
export const actPostToSuno = action({
  // Validators for arguments.
  args: {songDetails: v.any()},

  // Action implementation.
  handler: async (_,args) => {
    const result = await postToSuno(args.songDetails)

    // Optionally, return a value from your action
    return result;
  },
});

export async function getFromSuno(id: string) {
  try {
    // Send a GET request
    console.log("https://studio-api.suno.ai/api/external/clips/?ids={"+id+"}")
    const response = await fetch("https://studio-api.suno.ai/api/external/clips/?ids={"+id+"}", {
      method: "GET", // HTTP method
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
        "Authorization": "Bearer mCa8TXTHJJ71y5V0eIDrTcwkC7EQiO2V",
      }
    });

    // Check if the response is successful (status code 2xx)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse the response JSON
    const responseData = await response.json();

    // Log or return the response
    console.log("Response:", responseData);
    return responseData[0].audio_url; // Return audio URL
  } catch (error) {
    console.error("Error getting from API:", error);
  }
}

// run get from suno as an action:
export const actGetFromSuno = action({
  // Validators for arguments.
  args: {id: v.string()},

  // Action implementation.
  handler: async (_,args) => {
    console.log("it is "+args.id)
    const result = await getFromSuno(args.id)

    // Optionally, return a value from your action
    return result;
  },
});
