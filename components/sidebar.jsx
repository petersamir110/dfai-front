"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbReportAnalytics } from "react-icons/tb";
import { BsRobot } from "react-icons/bs";
import { HiHome } from "react-icons/hi2";

export default function SideBar() {
  const pathName = usePathname();
  
  return (

    <nav className="sticky top-14 left-0 h-[calc(100vh-56px)] z-40 flex flex-row justify-between items-start">
      <div className="pt-4 p-2 h-full w-16 flex flex-col gap-6 bg-[#03060C] border-[#303439]/40 border-r-2">
        <div className="pl-2 flex flex-col gap-4">
          <Link href={"/"}>
            <HiHome
              size={32}
              className={pathName === "/" || pathName === "" ? "text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "text-slate-500 hover:text-slate-300 transition-colors"}
            />
          </Link>
          <Link href={"/report"}>
            <TbReportAnalytics
              size={32}
              className={pathName === "/report" ? "text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "text-slate-500 hover:text-slate-300 transition-colors"}
            />
          </Link>
          <Link href={"/bot"}>
            <BsRobot
              size={32}
              className={pathName === "/bot" ? "text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)] " : "text-slate-500 hover:text-slate-300 transition-colors"}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
