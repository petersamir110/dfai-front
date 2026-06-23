"use client";
import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExtensionSelector } from "@/components/extensionSelector";

export default function ForensicsForm() {
  const [projectName, setProjectName] = useState("");
  const [path, setPath] = useState("");
  const [extension, setExtension] = useState(".mem"); 
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0); 
  const [taskCount, setTaskCount] = useState("0/0"); 
  const [statusText, setStatusText] = useState("Waiting to start..."); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPercent(0); 
    setTaskCount("0/0"); 
    setStatusText("Initializing Analysis...");

    try { 
      await fetch("/backend/project/delete", { method: "GET" }); 
    } catch (err) {
      console.log(err);
    }

    try {
      const response = await fetch("/backend/memory/path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, file_path: path + extension }),
      });

      if (!response.ok) { 
        try {
          const errorData = await response.json();
          setStatusText(`Backend Error (400): ${errorData.detail || "Bad Request"} ❌`);
        } catch (e) {
          setStatusText(`Backend Error: Server responded with status ${response.status} ❌`);
        }
        setLoading(false); 
        return; 
      }
      
      setStatusText("Connecting to live progress... 🔌");

      const socket = new WebSocket("ws://10.2.15.8:8000/ws/progress");

      socket.onopen = () => {
        setStatusText("Analysis Started... 🚀");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.percentage !== undefined) {
            setPercent(Math.round(Number(data.percentage))); 
          }
          
          if (data.finished_tasks !== undefined && data.all_tasks !== undefined) {
            setTaskCount(`${data.finished_tasks}/${data.all_tasks}`);
          }
          
          setStatusText(`Analyzing Memory Dump... ${data.percentage}%`);

          if (data.percentage === 100) {
            socket.close();
          }
        } catch (err) {
          setStatusText(event.data);
        }
      };

      socket.onclose = () => {
        setLoading(false);
        if (percent < 100) {
          setStatusText("Analysis paused or server closed connection. ⚠️");
        } else {
          setStatusText("Analysis Completed! 🎉");
        }
      };

      socket.onerror = () => {
        setStatusText("WebSocket Connection Failed! 🔌");
        setLoading(false);
      };

    } catch (error) {
      setStatusText("Network Error: Cannot connect to Backend server! 🌐");
      setLoading(false);
    }
  };

  const CheckIcon = () => (
    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );

  const SpinnerIcon = () => (
    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
  );

  return (
    <div className="flex flex-col items-center">
      <form className="w-120 flex flex-col gap-6" onSubmit={handleSubmit}>
        <Field className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-300 self-start">Project Name</span>
          <Input placeholder="Enter The Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
        </Field>
        
        <Field className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-300 self-start">Dump File Path</span>
          <div className="flex flex-row gap-2 items-center w-full">
            <ExtensionSelector value={extension} onChange={(val) => setExtension(val)} />
            <Input placeholder="Enter Dump File Path" value={path} onChange={(e) => setPath(e.target.value)} required />
          </div>
        </Field>
        
        <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-lg mt-2">
          {loading ? "Analyzing..." : "Submit"}
        </Button>

        <div className="w-full mt-6 relative">
          <div className="absolute top-4 left-[48px] right-[48px] h-[2px] z-0">
            <div className="w-full h-full bg-gray-800"></div>
            <div 
              className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300 ease-out shadow-[0_0_8px_#22c55e]" 
              style={{ width: `${percent}%` }}
            ></div>
          </div>

          <div className="w-full flex items-center justify-between relative z-20">
            <div className="flex flex-col items-center w-24">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 border border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                 <CheckIcon />
              </div>
              <span className="mt-2 text-[12px] text-gray-400 font-medium whitespace-nowrap">Read</span>
            </div>

            <div className="flex flex-col items-center w-24">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${percent === 100 ? 'bg-gray-900 border-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-gray-900 border-gray-600'}`}>
                {percent === 0 ? (
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                ) : percent < 100 ? (
                  <SpinnerIcon />
                ) : (
                  <CheckIcon />
                )}
              </div>
              <span className={`mt-2 text-[12px] font-semibold whitespace-nowrap ${percent > 0 && percent < 100 ? 'text-green-400 animate-pulse' : 'text-gray-400'}`}>
                Extracted
              </span>
            </div>

            <div className="flex flex-col items-center w-24">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 border transition-all duration-300 ${percent === 100 ? 'border-green-500 text-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'border-gray-800 text-gray-700'}`}>
                 <span className="text-xs font-bold">✓</span>
              </div>
              <span className={`mt-2 text-[12px] font-medium whitespace-nowrap ${percent === 100 ? 'text-gray-400' : 'text-gray-600'}`}>
                Analyzed
              </span>
            </div>
          </div>
        </div>

        <div className="w-full mt-6 space-y-2">
          <div className="flex justify-between items-end px-1">
            <span className="text-red-500 font-bold text-sm tracking-widest uppercase">
              {statusText}
            </span>
            <span className="text-white text-xs font-mono">
              Tasks: <span className="text-red-400">{taskCount}</span> | {percent}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700 shadow-inner relative">
            <div 
              className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      </form>
    </div>
  );
}