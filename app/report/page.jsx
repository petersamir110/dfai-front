"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ReportContent() {
  // نضيف وقت ثابت عند تحميل الصفحة لأول مرة، أو يمكنك استخدام Date.now() للتحديث الفوري
  const timestamp = new Date().getTime();
  const reportUrl = `http://10.2.15.9:8000/report?t=${timestamp}`;

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
      <div className="w-full border-b border-slate-800/40 p-4 shrink-0">
        <h1 className="text-xl font-mono text-blue-500 font-bold tracking-widest uppercase">
          Forensic Analysis Report
        </h1>
      </div>

      {/* الـ Container الخاص بالـ iframe */}
      <div className="flex-1 w-full overflow-hidden">
        <iframe
          key={timestamp} // استخدام key يجبر الـ iframe على إعادة التحميل إذا تغير الـ timestamp
          src={reportUrl}
          scrolling="no"
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