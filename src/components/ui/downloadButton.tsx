import React from "react";
import { Button } from "./button";
import "./styles/downloadButton.css";
interface DownloadButtonProps {
  fileUrl: string;
  fileName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  fileUrl,
  fileName,
}) => {
  const handleDownload = async () => {
    try {
      // Fetch the file from the URL
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      // Convert the file to a Blob
      const blob = await response.blob();

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      // Append the link to the body
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      // Revoke the object URL to free up memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <Button className="button" type="submit" onClick={handleDownload}>
      Download Music
    </Button>
  );
};

export default DownloadButton;
