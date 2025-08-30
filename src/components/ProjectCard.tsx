/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProjectCard({ project }: any) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/project/${project.id}`);
  };

  return (
    <div className="relative h-64 rounded-lg overflow-hidden shadow-lg group">
      <Image
        src={project.image}
        alt={project.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
        <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
        <button
          onClick={handleClick}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
}
