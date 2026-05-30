"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
export default function NavBar() {
  let pathName = usePathname();
  return (
    <div className="sticky top-0 z-10 p-2 border-b-2 bg-[#2a2a2a] border-[#303439]  flex items-center justify-center w-full">
      {/* Logo */}
      <div className="absolute left-2">
        <Image
          src="/images/side-bar-logo.png"
          alt="Logo"
          height={40}
          width={40}
          className="object-contain"
        />
      </div>

      {/* ProjectName #Work in Progress */}
      <div className="p-2 bg-[#1b1b1c] rounded-lg w-96 flex items-center border-2 border-[#303439]">
        <h1 className="pl-3 text-sm text-gray-200">
          {pathName === "/" ? "New Project" : pathName.slice(1)}
        </h1>
      </div>
    </div>
  );
}
