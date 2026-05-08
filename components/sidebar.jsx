"use client";
import Image from "next/image";
import { GrProjects } from "react-icons/gr";
import { GrSearchAdvanced } from "react-icons/gr";
import { useState } from "react";
import { GrDocument } from "react-icons/gr";

export default function SideBar() {
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);
  const projectList = ["Project 1", "Project 2", "Project 3", "Project 4"];
  return (
    <nav className=" top-0 left-0 h-screen z-50 flex flex-row justify-between items-start ">
      {/* Sidebar content */}
      <div className="pt-4 p-2 h-full w-16 flex flex-col gap-6 bg-[#2a2a2a] border-[#303439] border-r-2 ">
        {/* SideBar Icons */}
        <div className="pl-2 flex flex-col gap-4">
          <GrSearchAdvanced size={26} />
          <button
            onClick={() => setIsProjectListOpen(!isProjectListOpen)}
            className={`transition-colors  ${
              isProjectListOpen ? "text-blue-400" : ""
            }`}
          >
            <GrProjects size={26} />
          </button>
        </div>
      </div>
      {/* ProjectsList */}
      {isProjectListOpen && (
        <div className="bg-[#2a2a2a] border-[#303439] ] p-2 flex flex-col gap-2 h-full w-64 border-r-2  text-white">
          <div className=" flex flex-col p-4 gap-4">
            {projectList.map((project, index) => (
              <div className="flex flex-row gap-2" key={index}>
                <GrDocument />
                <h2 className="">{project}</h2>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
