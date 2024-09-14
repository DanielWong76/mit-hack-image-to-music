// import { useAction, useMutation, useQuery } from "convex/react";
// import { api } from "../convex/_generated/api";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";

// function App() {
//   const [newIdea, setNewIdea] = useState("");
//   const [includeRandom, setIncludeRandom] = useState(true);

//   const ideas = useQuery(api.myFunctions.listIdeas);
//   const saveIdea = useMutation(api.myFunctions.saveIdea);
//   const generateIdea = useAction(api.myFunctions.fetchRandomIdea);

//   return (
//     <>
//       <main className="container max-w-2xl flex flex-col gap-8">
//         <h1 className="text-3xl font-extrabold mt-8 text-center">
//           Get hacking with Convex
//         </h1>

//         <h2 className="text-center">Let's brainstorm apps to build!</h2>

//         <form className="flex gap-2">
//           <Input
//             type="text"
//             value={newIdea}
//             onChange={(event) => setNewIdea(event.target.value)}
//             placeholder="Type your app idea here"
//           />
//           <Button
//             type="submit"
//             disabled={!newIdea}
//             title={
//               newIdea
//                 ? "Save your idea to the database"
//                 : "You must enter an idea first"
//             }
//             onClick={async (e) => {
//               e.preventDefault();
//               await saveIdea({ idea: newIdea.trim(), random: false });
//               setNewIdea("");
//             }}
//             className="min-w-fit"
//           >
//             Save idea
//           </Button>
//         </form>

//         <div className="flex justify-between items-center">
//           <Button
//             onClick={async () => {
//               await generateIdea();
//             }}
//             title="Save a randomly generated app idea to the database"
//           >
//             Generate a random app idea
//           </Button>

//           <div
//             className="flex gap-2"
//             title="Uh oh, this checkbox doesn't work! Until we fix it ;)"
//           >
//             <Checkbox
//               id="show-random"
//               checked={includeRandom}
//               onCheckedChange={() => setIncludeRandom(!includeRandom)}
//             />
//             <Label htmlFor="show-random">
//               Include random ideas
//               <br />
//               <span className="text-[16px] font-mono">
//                 [TODO: see exercise in README]
//               </span>
//             </Label>
//           </div>
//         </div>

//         <ul>
//           {ideas?.map((document, i) => (
//             <li key={i}>
//               {document.random ? "🤖 " : "💡 "}
//               {document.idea}
//             </li>
//           ))}
//         </ul>
//       </main>
//       <footer className="text-center text-xs mb-5 mt-10 w-full">
//         <p>
//           Built with <a href="https://convex.dev">Convex</a>,{" "}
//           <a href="https://www.typescriptlang.org">TypeScript</a>,{" "}
//           <a href="https://react.dev">React</a>, and{" "}
//           <a href="https://vitejs.dev">Vite</a>
//         </p>
//         <p>
//           Random app ideas thanks to{" "}
//           <a target="_blank" href="https://appideagenerator.com/">
//             appideagenerator.com
//           </a>
//         </p>
//       </footer>
//     </>
//   );
// }

// export default App;

import { FormEvent, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button"; 
import { api } from "../convex/_generated/api";

export default function App() {
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
  async function handleSendImage(event: FormEvent) {
    event.preventDefault();

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });
    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    await sendImage({ storageId, author: name });

    setSelectedImage(null);
    imageInput.current!.value = "";
  }
  return (
    <>
    <form onSubmit={handleSendImage}>
      <input
        type="file"
        accept="image/*"
        ref={imageInput}
        onChange={(event) => setSelectedImage(event.target.files![0])}
        disabled={selectedImage !== null}
      />
      <input
        type="submit"
        value="Send Image"
        disabled={selectedImage === null}
      />
    </form>
    <Button
      type="submit"
      disabled={!imageInput}
      onClick={async (e) => {
        e.preventDefault();
        await api.listMessages.getImages({});
      }}
      className="min-w-fit"
      >
      Get Images
    </Button>
    </>
  );
}

