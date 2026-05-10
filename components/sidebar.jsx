"use client";
import Image from "next/image";
import { GrProjects } from "react-icons/gr";
import { GrSearchAdvanced } from "react-icons/gr";
import { useState } from "react";
import { GrDocument } from "react-icons/gr";
import Link from "next/link";
import { projectList, formatSlug } from "@/lib/projects";

export default function SideBar() {
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);
  const projectList = [
    { name: "Project-1", id: 1 },
    { name: "Project-2", id: 2 },
    { name: "Project-3", id: 3 },
    { name: "Project-4", id: 4 },
  ];
  const formatSlug = (val) =>
    val
      .toString()
      .replace(/ /g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .toLowerCase(); // Convert to lowercase

  return (
    <nav className="sticky top-0 left-0 h-screen z-50 flex flex-row justify-between items-start ">
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
            {projectList.map((project) => (
              <Link
                href={`/projects/${formatSlug(project.name)}`}
                className="flex flex-row gap-2 hover:text-blue-400"
                key={project.id}
              >
                <GrDocument />
                <h2>{project.name}</h2>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
