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
  
  // --- 🔘 مخازن الداتا الخاصة بالتحميل لايف ---
  const [percent, setPercent] = useState(0); // الرقم المئوي الفعلي (لتحريك الشريط)
  const [statusText, setStatusText] = useState("Waiting to start..."); // كلمة الحالة

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPercent(0); // تصغير الشريط لـ 0 عند كل ضغطة Submit
    setStatusText("Initializing Analysis...");

    // 1️⃣ حذف القديم (HTTP GET)
    try { await fetch("/backend/project/delete", { method: "GET" }); } catch (err) {}

    // 2️⃣ إرسال الجديد (HTTP POST) - الداتا بتبعت هنا
    try {
      const response = await fetch("/backend/memory/path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, file_path: `${path}${extension}` }),
      });

      if (!response.ok) { setLoading(false); return; }
      
      // 3️⃣ فتح الـ WebSocket للمتابعة لايف - المتابعة بتبدأ هنا
      const wsUrl = "ws://10.2.15.8:8000/ws/progress"; // العنوان المأخوذ من Apidog
      const socket = new WebSocket(wsUrl);

      // أول ما الخط يفتح بنجاح
      socket.onopen = () => {
        console.log("🔌 خط الـ WebSocket فتح وجاري الاستماع للتحديثات...");
      };

      // أول ما السيرفر يبعت تحديث جديد أو نسبة تحميل (JSON)
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // 💡 السحر هنا: بناخد النسبة المئوية ونحدث بيها المخزن الفعلي
          if (data.percentage !== undefined) setPercent(data.percentage);
          
          // تحديث رسالة الحالة المعروضة
          setStatusText(`Analyzing... ${data.percentage}% Complete`);

          // أول ما يوصل 100% نقفل الخط
          if (data.percentage === 100) socket.close();
        } catch (err) {
          // لو الرد مش JSON بنعرضه ككلمة حالة
          setStatusText(event.data);
        }
      };

      // أول ما الخط يقفل (سواء التحليل خلص أو حصلت قفلة)
      socket.onclose = () => {
        setLoading(false);
        if(percent === 100) setStatusText("Analysis Complete! 🎉");
      };

    } catch (error) {
      console.error("حدث خطأ في العملية:", error);
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  // --- 💡 أيقونة علامة الصح (SVG) ---
  const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-500 shadow-[0_0_8px_#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );

  // --- 💡 أيقونة الـ Spinner للتحميل (SVG) ---
  const SpinnerIcon = () => (
    <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
  );

  return (
    <div className="flex flex-col items-center">
      <form className="w-120 flex flex-col gap-8" onSubmit={handleSubmit}>
        {/* خانة اسم المشروع */}
        <Field>
          <Input placeholder="Enter The Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
        </Field>
        
        {/* خانة المسار والـ Selector */}
        <Field className="flex flex-row gap-2 items-center">
          <ExtensionSelector value={extension} onChange={(val) => setExtension(val)} />
          <Input placeholder="Enter Dump File Path" value={path} onChange={(e) => setPath(e.target.value)} required />
        </Field>
        
        {/* زرار الـ Submit */}
        <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-lg transition-colors">
          {loading ? "Analyzing..." : "Submit"}
        </Button>

        {/* ----------------------------------------------------------- */}
        {/* 📊 شريط الخطوات (Stepper) الديناميكي الحقيقي الجديد */}
        {/* ----------------------------------------------------------- */}
        <div className="w-full mt-10 px-8 relative">
          
          {/* خلفية الشريط (الخط الرمادي) اللي بيملا Interval (1->2) */}
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gray-700 -translate-y-1/2 rounded-full z-0 px-8"></div>

          {/* 💡 السحر الفعلي: الخط الأخضر المتحرك (1->2) اللي بيملى بناءً على percent% */}
          <div
            className="absolute top-1/2 left-0 h-[3px] bg-green-500 -translate-y-1/2 rounded-full z-10 transition-all duration-300 ease-out shadow-[0_0_10px_#22c55e] ml-8"
            style={{ width: `calc(${percent}% - 32px)` }} // Filling interval 1-2
          ></div>

          {/* الخط الأخضر المتحرك (2->3) - بيملى بس أول ما الـ 2 توصل 100% */}
          {percent === 100 && (
             <div className="absolute top-1/2 left-[calc(100%-32px)] w-8 h-[3px] bg-green-500 -translate-y-1/2 rounded-full z-10 shadow-[0_0_10px_#22c55e]"></div>
          )}

          {/* صف الخطوات (Nodes) */}
          <div className="w-full flex items-center justify-between relative gap-0">

            {/* 1️⃣ الخطوة الأولى: Input (ثابتة لأنها بتخلص أول ما تدوس) */}
            <div className="relative z-20 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 border-2 border-green-500 text-green-500 shadow-[0_0_10px_#22c55e]">
                 <CheckIcon />
              </div>
              <span className="absolute top-full mt-2 text-[11px] text-gray-400">Input</span>
            </div>

            {/* 2️⃣ الخطوة الثانية: Analyzing (داينمك بناءً على النسبة) */}
            <div className="relative z-20 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-out ${percent === 100 ? 'bg-green-500 border-green-500 text-white shadow-[0_0_15px_#22c55e]' : 'bg-gray-900 border-2 border-green-400 text-green-400'}`}>
                {/*Inside: Spinner while analyzing, Checkmark when done */}
                {percent < 100 ? <SpinnerIcon /> : <CheckIcon /> }
              </div>
              <span className={`absolute top-full mt-2 text-[11px] font-semibold ${percent < 100 ? 'text-white' : 'text-gray-400'}`}>Analyzing</span>
            </div>

            {/* 3️⃣ الخطوة الثالثة: Done (بتستنى الـ Analyze يخلص) */}
            <div className="relative z-20 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${percent === 100 ? 'border-green-500 bg-gray-900 text-green-500 shadow-[0_0_10px_#22c55e]' : 'border-gray-600 bg-gray-900 text-gray-600'}`}>
                 <span className="font-mono text-sm font-bold">✓</span>
              </div>
              <span className="absolute top-full mt-2 text-[11px] text-gray-600">Done</span>
            </div>
            
          </div>
          
           {/* ريسالة الحالة النصية تحت الشريط */}
          <div className="text-center mt-12 text-[11px] text-gray-400 font-medium">
             Current Status: <span className="text-green-300 font-mono">{statusText}</span>
          </div>

        </div>
      </form>
    </div>
  );
}