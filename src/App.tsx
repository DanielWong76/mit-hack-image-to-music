import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Header from "./components/ui/header";
import FileUploaderScreen from "./screens/FileUploadScreen";

function App() {
  const [newIdea, setNewIdea] = useState("");
  const [includeRandom, setIncludeRandom] = useState(true);

  const ideas = useQuery(api.myFunctions.listIdeas);
  const saveIdea = useMutation(api.myFunctions.saveIdea);
  const generateIdea = useAction(api.myFunctions.fetchRandomIdea);

  return (
    <div>
      <Header/>
      <FileUploaderScreen/>
    </div>
  );
}

export default App;
