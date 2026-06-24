"use client";
import { FaRobot } from "react-icons/fa";
import { GrSearchAdvanced } from "react-icons/gr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbReportAnalytics } from "react-icons/tb";
import { BsRobot } from "react-icons/bs";
import { HiHome } from "react-icons/hi2";



export default function SideBar() {
  const pathName = usePathname();
  return (
    <nav className="sticky top-0 left-0 h-screen z-50 flex flex-row justify-between items-start ">
      {/* Sidebar content */}
      <div className="pt-4 p-2 h-full w-16 flex flex-col gap-6 bg-[#2a2a2a] border-[#303439] border-r-2 ">
        {/* SideBar Icons */}
        <div className="pl-2 flex flex-col gap-4">
          <Link href={"/"}>
            <HiHome
              size={32}
              className={pathName === "/" || "" ? "text-red-600" : ""}
            />
          </Link>
          <Link href={"/report"}>
            <TbReportAnalytics
              size={32}
              className={pathName === "/report" || "" ? "text-red-600" : ""}
            />
          </Link>
          <Link href={"/bot"}>
            <BsRobot
              size={32}
              className={pathName === "/bot" || "" ? "text-red-600" : ""}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
