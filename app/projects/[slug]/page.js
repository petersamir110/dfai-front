import { projectList, formatSlug } from "@/lib/projects";
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projectList.find((p) => formatSlug(p.name) === slug);
  if (!project) notFound();

  return <h1>{project.name}</h1>;
}
