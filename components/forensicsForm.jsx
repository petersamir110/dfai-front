"use client";
import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForensicsForm() {
  const [projectName, setProjectName] = useState("");
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(false);

  // Spelled correctly: single 'm'
  const handleSubmit = async (e) => {
    e.preventDefault(); // Forces the browser to stop the default GET behavior
    setLoading(true);

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://127.0.0.1:3658/m1/1270600-1268652-default";
    const endpointPath = "/memory/path";
    const fullUrl = `${baseUrl}${endpointPath}`;

    console.log("Sending POST request to:", fullUrl);

    const payload = {
      project_name: projectName,
      file_path: path,
    };

    try {
      const response = await fetch(fullUrl, {
        method: "POST", // Apidog expects POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Apidog Mock Response:", data);
      alert("Memory Dump Triggered Successfully!");
    } catch (error) {
      console.error("Failed to POST memory dump:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Handled with standard spelling */}
      <form className="w-120 flex flex-col gap-8" onSubmit={handleSubmit}>
        <Field>
          <Input
            id="input-field-projectName"
            type="text"
            placeholder="Enter The Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </Field>
        <Field className="flex flex-row justify-center items-center gap-2">
          <Input
            id="input-field-mem"
            type="text"
            placeholder=".mem"
            className="w-20"
            disabled
          />
          <Input
            id="input-field-dumpPath"
            type="text"
            placeholder="Enter Dump File Path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            required
          />
        </Field>
        <Button type="submit" className="cursor-pointer" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
