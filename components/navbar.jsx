"use client";

import Image from "next/image";
import { useProject } from "@/context/ProjectContext";

export default function NavBar() {
  const { projectTitle } = useProject();
  return (
    <div className="sticky top-0 z-50 h-14 p-2 border-b-2 bg-[#03060C] border-[#303439]/40 flex items-center justify-between w-full">
      <div className="flex items-center">
        <Image
          src="/images/side-bar-logo.png"
          alt="DFAI Logo"
          height={40}
          width={40}
          className="object-contain"
        />
      </div>

      <div className="p-2 bg-[#080d1a] rounded-lg w-96 flex items-center justify-center border border-[#303439]/60 h-9">
        <h1 className="pl-3 text-gray-300 font-medium layout-title capitalize text-2xl">
          {projectTitle === "" ? "New Project" : projectTitle}
        </h1>
      </div>

      <div className="flex flex-row items-center gap-1">
        <Image
          src="/images/Digilians.png"
          alt="Digilians Logo"
          height={50}
          width={50}
          className="object-contain"
        />
        <Image
          src="/images/Egyma.png"
          alt="Egyma Logo"
          height={50}
          width={50}
          className="object-contain"
        />
      </div>
    </div>
  );
}
