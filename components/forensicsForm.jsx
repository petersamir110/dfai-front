"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExtensionSelector } from "@/components/extensionSelector";
import { CheckIcon } from "lucide-react";

export default function ForensicsForm({ setTitle }) {
  const router = useRouter();
  
  // States
  const [projectName, setProjectName] = useState("");
  const [path, setPath] = useState("");
  const [extension, setExtension] = useState("");
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [taskCount, setTaskCount] = useState("0/0");
  const [statusText, setStatusText] = useState("Waiting to start...");
  const [activeStep, setActiveStep] = useState(1);
  const [isError, setIsError] = useState(false);

  const percentRef = useRef(0);
  const extractionSocketRef = useRef(null);
  const analysisSocketRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    const handleTabClose = () => {
      fetch("http://localhost:9000/project/delete", {
        method: "GET",
        keepalive: true,
      }).catch((err) => console.log("Unload cleanup failed:", err));
    };

    window.addEventListener("beforeunload", handleTabClose);
    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
      if (extractionSocketRef.current) extractionSocketRef.current.close();
      if (analysisSocketRef.current) analysisSocketRef.current.close();
    };
  }, []);

  // دالة الاتصال بـ WebSocket التحليل (Analysis)
  const startAnalysisProcess = () => {
    setStatusText("Starting Analysis...");
    setActiveStep(3);

    if (analysisSocketRef.current) {
      analysisSocketRef.current.close();
    }

    // الـ Endpoint الجديدة للـ Analysis من الصورة
    analysisSocketRef.current = new WebSocket("ws://localhost:7000/ws/analysis");

    analysisSocketRef.current.onopen = () => {
      setStatusText("Analysis Running...");
      // إرسال الرسالة المطلوبة بعد فتح الاتصال
      analysisSocketRef.current.send(JSON.stringify({ event: "analysis" }));
    };

    analysisSocketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // التعامل مع الرسالة الراجعة من الـ Backend
        if (data.event === "analysis_finished" || data.status === "success") {
          setStatusText(data.message || "Analysis Finished Successfully!");
          setLoading(false);
        }
      } catch (err) {
        console.error("Analysis message error", err);
      }
    };

    analysisSocketRef.current.onerror = (error) => {
      console.error("Analysis WebSocket Error:", error);
      setIsError(true);
      setStatusText("Analysis Connection Failed!");
      setLoading(false);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setTitle) {
      setTitle(projectName);
    }
    setLoading(true);
    setIsError(false);
    setPercent(0);
    percentRef.current = 0;
    setTaskCount("0/0");
    setStatusText("Initializing Analysis...");
    setActiveStep(1);

    try {
      await fetch("http://localhost:9000/project/delete", { method: "GET" });
    } catch (err) {
      console.log(err);
    }

    const finalPath = path.endsWith(extension) ? path : path + extension;
    console.log(finalPath);
    try {
      const response = await fetch("http://localhost:9000/memory/path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectName,
          file_path: finalPath,
        }),
      });

      if (!response.ok) {
        setIsError(true);
        try {
          const errorData = await response.json();
          setStatusText(`Error: ${errorData.detail || "Bad Request"}`);
        } catch (e) {
          setStatusText(`Error: Server status ${response.status}`);
        }
        setLoading(false);
        return;
      }

      setStatusText("Connecting to live progress...");
      
      // فتح سوكيت التقدم (Progress WebSocket)
      extractionSocketRef.current = new WebSocket("ws://localhost:9000/ws/progress");

      extractionSocketRef.current.onopen = () => {
        setStatusText("Analyzing Memory Dump...");
        setActiveStep(2);
      };

      extractionSocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.percentage !== undefined) {
            const currentPercent = Math.round(Number(data.percentage));
            setPercent(currentPercent);
            percentRef.current = currentPercent;

            if (currentPercent === 100) {
              setStatusText("Extraction Completed!");
              if (extractionSocketRef.current) extractionSocketRef.current.close();
              
              // بعد الانتهاء، بيتم قفل Extraction WebSocket وبدء الـ Analysis مباشرة
              startAnalysisProcess();
            }
          }
          
          if (data.finished_tasks !== undefined && data.all_tasks !== undefined) {
            setTaskCount(`${data.finished_tasks}/${data.all_tasks}`);
          }
        } catch (err) {
          console.error("Extraction message error", err);
          setStatusText("Parsing error occurred");
        }
      };

      extractionSocketRef.current.onclose = () => {};

      extractionSocketRef.current.onerror = () => {
        if (percentRef.current < 100) {
          setIsError(true);
          setStatusText("WebSocket Connection Failed!");
          setLoading(false);
        }
      };
      
    } catch (error) {
      setIsError(true);
      setStatusText("Network Error: Backend unreachable!");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form className="w-120 flex flex-col gap-6" onSubmit={handleSubmit}>
        <Field className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 self-start">
            Project Name
          </span>
          <Input
            className="bg-[#03060C] border border-slate-800/60 text-slate-200 focus:border-red-600/50 focus:ring-1 focus:ring-red-600/30 placeholder-slate-600 h-11"
            placeholder="Enter The Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </Field>

        <Field className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 self-start">
            Dump File Path
          </span>
          <div className="flex flex-row gap-2 items-center w-full">
            <ExtensionSelector
              value={extension}
              onChange={(val) => setExtension(val)}
            />
            <Input
              className="bg-[#03060C] border border-slate-800/60 text-slate-200 focus:border-red-600/50 focus:ring-1 focus:ring-red-600/30 placeholder-slate-600 h-11"
              placeholder="Enter Dump File Path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              required
            />
          </div>
        </Field>

        <Button
          type="submit"
          disabled={loading}
          className="border border-blue-600/40 bg-blue-950/10 text-blue-500 hover:bg-blue-600 hover:text-white font-bold h-12 rounded-lg mt-2 transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.08)] uppercase tracking-widest text-sm"
        >
          {loading ? "Analyzing..." : "Submit"}
        </Button>

        {activeStep === 3 && !loading && (
          <Button
            type="button"
            onClick={() => router.push(`/report?project_name=${encodeURIComponent(projectName)}`)}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] uppercase tracking-widest text-sm"
          >
            View Full Report
          </Button>
        )}

        <div className="w-full max-w-md mx-auto mt-4 mb-2 select-none relative">
            <div className="absolute left-[calc(16.66%-14px)] right-[calc(16.66%-14px)] top-[14px] h-[2px] z-0">
            <div className="w-full h-full bg-slate-800/40 rounded-full" />
            <div
              className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              style={{
                width: activeStep === 1 ? "0%" : activeStep === 2 ? `${percent / 2}%` : "100%",
              }}
            />
          </div>

          <div className="flex justify-between items-center relative z-10">
            <div className="flex flex-col items-center flex-1">
              <div className="size-7 rounded-full flex items-center justify-center border bg-[#020307] border-emerald-500/80 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)] transition-all duration-300">
                <CheckIcon className="size-3.5 stroke-[3]" />
              </div>
              <span className="text-[11px] font-mono mt-2 tracking-wide text-emerald-400 font-semibold">
                Read
              </span>
            </div>

            <div className="flex flex-col items-center flex-1">
              <div
                className={`size-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  activeStep >= 2
                    ? "bg-[#020307] border-emerald-500/80 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                    : "bg-[#020307] border-slate-800/60"
                }`}
              >
                {activeStep >= 2 ? (
                  <CheckIcon className="size-3.5 stroke-[3]" />
                ) : (
                  <div className="size-1.5 rounded-full bg-slate-700" />
                )}
              </div>
              <span
                className={`text-[11px] font-mono mt-2 tracking-wide transition-colors duration-300 ${
                  activeStep >= 2
                    ? "text-emerald-400 font-semibold"
                    : "text-slate-600"
                }`}
              >
                Extracted
              </span>
            </div>

            <div className="flex flex-col items-center flex-1">
              <div className={`size-7 rounded-full flex items-center justify-center border transition-all duration-300 ${activeStep === 3 ? "bg-[#020307] border-emerald-500/80 text-emerald-400" : "bg-[#020307] border-slate-800/60"}`}>
                <div className={`size-1.5 rounded-full ${activeStep === 3 ? "bg-emerald-500" : "bg-slate-700"}`} />
              </div>
              <span className={`text-[11px] font-mono mt-2 tracking-wide ${activeStep === 3 ? "text-emerald-400" : "text-slate-700"}`}>
                Analyzed
              </span>
            </div>
          </div>
        </div>

        <div className="w-full mt-2 flex flex-col gap-2 select-none">
          <div className="flex justify-between items-center text-[11px] font-mono tracking-wider">
            <span
              className={`font-bold uppercase ${
                activeStep === 3
                  ? "text-emerald-500"
                  : isError
                    ? "text-red-500 animate-pulse"
                    : "text-red-600"
              }`}
            >
              {statusText}
            </span>
            <span className="text-slate-400">
              Tasks:{" "}
              <span
                className={`font-bold ${activeStep === 3 ? "text-emerald-500" : "text-red-500"}`}
              >
                {taskCount}
              </span>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}