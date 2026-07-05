"use client";
import ForensicsForm from "@/components/forensicsForm";
import { Steps } from "@/components/steps";
import { Shield } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export default function Home() {
  const { setProjectTitle } = useProject();
  return (
    <div className="flex flex-col flex-1 bg-[#070b14] justify-center items-center p-12 gap-12 h-full">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bitcount+Grid+Double:wght@100..900&display=swap');
      `,
        }}
      />
      <div className="flex flex-col items-center w-full max-w-2xl select-none">
        <div className="flex items-center justify-center w-full gap-4 mb-3">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-blue-600/60" />

          <div className="text-blue-500 opacity-90 p-1 bg-blue-950/30 rounded border border-blue-900/40 backdrop-blur-sm">
            <Shield className="size-4 stroke-[1.5]" />
          </div>

          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-blue-600/60" />
        </div>

        <h1
          style={{ fontFamily: "'Bitcount Grid Double', sans-serif" }}
          className="text-3xl text-blue-600 tracking-wider uppercase text-center drop-shadow-[0_0_8px_rgba(37,99,235,0.4)] whitespace-nowrap"
        >
          ARTIFACTS DO NOT LIE, PEOPLE DO
        </h1>
      </div>
      <ForensicsForm setTitle={setProjectTitle} />
    </div>
  );
}