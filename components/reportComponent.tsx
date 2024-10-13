import React, { ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

import { useToast } from "@/hooks/use-toast";

import { useState } from "react";
import { headers } from "next/headers";

type Props = {};

const ReportComponent = (props: Props) => {
  const { toast } = useToast();
  const [base64Data, setBase64Data] = useState("");

  function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file) {
      let isValidImage = false;
      let isValidDoc = false;

      const validImages = ["image/jpeg", "image/png", "image/webp"];
      const validDocs = ["application/pdf"];

      if (validImages.includes(file.type)) {
        isValidImage = true;
      }
      if (validDocs.includes(file.type)) {
        isValidDoc = true;
      }

      if (!(isValidImage || isValidDoc)) {
        toast({
          //title: "Sc: Catch up",
          description: "ERROR! File type not supported.",
          variant: "destructive",
        });
        return;
      }

      if (isValidDoc) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileContent = reader.result as string;
          console.log(fileContent);
          setBase64Data(fileContent);
        };
        reader.readAsDataURL(file);
      }

      if (isValidImage) {
        compressImage(file, (compressedFile: File) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const fileContent = reader.result as string;
            console.log(fileContent);
            setBase64Data(fileContent);
          };
          reader.readAsDataURL(compressedFile);
        });
      }
    }
  }

  async function extractDetails(): void {
    if (!base64Data) {
      toast({
        description: "Upload a valid file type!",
        variant: "destructive",
      });
      return;
    }
    //if base 64 data does exists send API restore
    const response = await fetch("api/extractreportgemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64: base64Data,
      }),
    });
    if (response.ok) {
      const reportText = await response.text();
      console.log(reportText);
    }
  }

  return (
    <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
      <fieldset className="relative grid gap-6 rounded-lg border p-4">
        <legend className="text-sm font-medium">Report</legend>

        <Input
          className="bg-[#04a5ea]"
          type="file"
          onChange={handleReportSelection}
        />
        <Button className="bg-[#06c37e]" onClick={extractDetails}>
          {" "}
          1. Upload File
        </Button>
        <Label>Report Summary</Label>
        <Textarea
          placeholder="Extracted Data from the report will appear here."
          className="min-h-72 resize-none border-0 p-3 shadow-none "
        />
        <Button className="bg-[#06c37e]">2. Add to Chat-Bot knowledge </Button>
      </fieldset>
    </div>
  );
};

export default ReportComponent;

function compressImage(file: File, callback: (compressFile: File) => void) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      //create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      //set Canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      //Draw the image onto the canvas
      ctx!.drawImage(img, 0, 0);

      //apply basic compression (adjust quality as needed)
      const quality = 0.1; //asjust quality as needed

      //convert canvas to data URL
      const dataURL = canvas.toDataURL("image/jpeg", quality);

      //conavert data URL back to Blob
      const byteString = atob(dataURL.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const compressedFile = new File([ab], file.name, { type: "image/jpeg" });
      callback(compressedFile);
    };
    img.src = e.target!.result as string;
  };
  reader.readAsDataURL(file);

  //throw new Error("Function not implemented.");
}
