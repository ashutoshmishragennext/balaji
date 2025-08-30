'use client';
import React, { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the Project interface
interface Project {
  id: string | number;
  name: string;
  coverImage: string;
}

// Define the API response interface
interface ProjectsApiResponse {
  data: Project[];
}

export default function ProjectGrid(): JSX.Element {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects(): Promise<void> {
      try {
        const res: Response = await fetch('/api/projects');
        const data: ProjectsApiResponse = await res.json();
        
        console.log('Fetched Projects:', data); // 🧪 Debug log
        setProjects(data.data);
      } catch (error: unknown) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleGeneratePDF = (projectId: string | number): void => {
    router.push(`/page/${projectId}`);
  };

  if (loading) {
    return <p className="text-center text-lg">Loading projects...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10">
      {projects.map((project: Project) => (
        <div
          key={project.id}
          className="relative bg-cover bg-center rounded-xl overflow-hidden shadow-lg h-64 flex items-end"
          style={{ backgroundImage: `url(${project.coverImage})` }}
        >
          <div className="bg-black bg-opacity-50 w-full p-4 text-white">
            <h3 className="text-xl font-semibold">{project.name}</h3>
            <button
              onClick={() => handleGeneratePDF(project.id)}
              className="mt-2 bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition"
            >
              Generate PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}