/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';

async function getProjects() {
  const res = await fetch('http://localhost:3000/api/projects'); // Use full URL for local fetch
  return res.json();
}

export default async function ProjectDetail({ params }: any) {
  const projects = await getProjects();
  const project = projects.find((p: any) => p.id === params.id);

  if (!project) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <img src={project.image} alt={project.name} className="rounded-lg shadow w-full max-w-xl" />
      <p className="mt-4 text-gray-700">{project.description}</p>
    </div>
  );
}
