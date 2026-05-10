export const projectList = [
  { name: "Project-1", id: 1 },
  { name: "Project-2", id: 2 },
  { name: "Project-3", id: 3 },
  { name: "Project-4", id: 4 },
];

export const formatSlug = (val) =>
  val
    .toString()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();
