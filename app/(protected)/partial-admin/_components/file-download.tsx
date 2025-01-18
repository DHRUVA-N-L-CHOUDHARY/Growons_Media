"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

const FileDownload = ({
  secure_url,
  fileName,
}: {
  secure_url: string;
  fileName: string;
}) => {
  const downloadFile = async () => {
    try {
      const response = await fetch(secure_url);

      // Check for fetch errors
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; 
      document.body.appendChild(a);

      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      toast.success("File downloaded successfully!");
    } catch (error: any) {
      console.error("Error downloading the file", error);

      if (error.message.includes("CORS")) {
        toast.error("Download failed due to cross-origin issues.");
      } else if (error.message.includes("HTTP Error")) {
        toast.error("File could not be retrieved from the server.");
      } else {
        toast.error("An unknown error occurred. Please try again.");
      }
    }
  };
  return (
    <Button variant={"ghost"} onClick={downloadFile}>
      <p className="capitalize font-bold">
        {fileName.split(".")[0].length > 40
          ? `${fileName.split(".")[0].slice(0, 37)}...`
          : fileName.split(".")[0]}
      </p>
      <Download className="w-5 h-5 m-4" />
    </Button>
  );
};

export default FileDownload;
