"use client";
import { createContext, useContext, useState } from "react";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [submittedName, setSubmittedName] = useState(""); // هنا هنخزن الاسم

  return (
    <ProjectContext.Provider value={{ submittedName, setSubmittedName }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);