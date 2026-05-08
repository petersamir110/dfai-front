"use client";

import { File } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Uploadbox() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
  });

  return (
    <div>
      <div>
        <div>
          <Label htmlFor="file-upload-2" className="font-medium">
            Upload IOCs
          </Label>
          <div
            {...getRootProps()}
            className={cn(
              isDragActive
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-border bg-[#1b1b1c] ",
              "mt-2 flex justify-center rounded-md border border-dashed px-6 py-20 transition-colors duration-200",
            )}
          >
            <div>
              <File
                className="mx-auto h-12 w-12 text-muted-foreground/80"
                aria-hidden={true}
              />
              <div className="mt-4 flex text-muted-foreground">
                <p>Drag and drop or</p>
                <label
                  htmlFor="file"
                  className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:text-primary/80 hover:underline hover:underline-offset-4"
                >
                  <span>choose file(s)</span>
                  <input
                    {...getInputProps()}
                    id="file-upload-2"
                    name="file-upload-2"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="text-pretty pl-1">to upload</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
