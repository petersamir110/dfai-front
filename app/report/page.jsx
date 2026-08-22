"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ReportContent() {
  const searchParams = useSearchParams();
  const projectName = searchParams.get("project_name");

  // إضافة timestamp لمنع الـ Caching ورابط الـ Endpoint الجديدة من الصورة
  const timestamp = new Date().getTime();
  
  // بناء رابط التقرير مع إضافة اسم المشروع كـ Query Param إذا كان موجوداً
  const baseUrl = "http://localhost:7000/report";
  const reportUrl = projectName 
    ? `${baseUrl}?project_name=${encodeURIComponent(projectName)}&t=${timestamp}`
    : `${baseUrl}?t=${timestamp}`;

  return (
    <div className="flex flex-col w-full h-[calc(100vh-60px)] bg-[#070b14] overflow-hidden">
      
      {/* ستايل لغلق أي مسافات خارجية للمتصفح */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>

      {/* الهيدر */}
      <div className="w-full border-b border-slate-800/40 p-4 shrink-0 flex justify-between items-center">
        <h1 className="text-xl font-mono text-blue-500 font-bold tracking-widest uppercase">
          Forensic Analysis Report
        </h1>
        {projectName && (
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">
            Project: <span className="text-emerald-400 font-semibold">{projectName}</span>
          </span>
        )}
      </div>

      {/* الـ Container الخاص بالـ iframe */}
      <div className="flex-1 w-full overflow-hidden">
        <iframe
          key={timestamp}
          src={reportUrl}
          scrolling="yes"
          className="w-full h-full border-none block" 
          title="Volatility Forensic Report"
        />
      </div>
      
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center w-full h-screen bg-[#070b14] text-blue-500 font-mono text-lg animate-pulse">
          LOADING FORENSIC REPORT DATA...
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}