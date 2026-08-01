"use client";
import { createContext, useContext, useState } from "react";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projectTitle, setProjectTitle] = useState("");

  return (
    <ProjectContext.Provider value={{ projectTitle, setProjectTitle }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);