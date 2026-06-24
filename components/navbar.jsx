"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar() {
  let pathName = usePathname();
  
  return (

    <div className="sticky top-0 z-50 h-14 p-2 border-b-2 bg-[#03060C] border-[#303439]/40 flex items-center justify-between w-full">
      
      {/* DFAI Logo */}
      <div className="flex items-center">
        <Image
          src="/images/side-bar-logo.png"
          alt="DFAI Logo"
          height={40}
          width={40}
          className="object-contain"
        />
      </div>

      {/* ProjectName #Work in Progress */}
      <div className="p-2 bg-[#080d1a] rounded-lg w-96 flex items-center border border-[#303439]/60 h-9">
        <h1 className="pl-3 text-sm text-gray-300 font-medium layout-title">
          {pathName === "/"
            ? "New Project"
            : pathName.slice(1, 2).toUpperCase() + pathName.slice(2)}
        </h1>
      </div>

      {/* Other Logos */}
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