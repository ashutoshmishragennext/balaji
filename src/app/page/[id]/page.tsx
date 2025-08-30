/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';

interface ProjectSection {
  id: string;
  order: number;
  heading: string;
  description: string;
}

interface ApiProject {
  id: string;
  logo: string | null;
  name: string;
  websiteUrl?: string | null;
  bio?: string | null;
  description?: string;
  contentJson?: {
    metadata?: {
      version: string;
      lastModified: string;
    };
    sections?: ProjectSection[];
  };
  coverImage?: string | null;
}

interface ApiResponse {
  success: boolean;
  data: ApiProject[];
}

interface TransformedData {
  title: string;
  hospitalName: string;
  website: string;
  bio: string;
  logo: string;
  description: string;
  coverImage?: string;
  dynamicSections: {
    heading: string;
    description: string;
  }[];
}

const transformApiData = (apiProject: ApiProject): TransformedData => {
  const sections = apiProject.contentJson?.sections || [];

  return {
    title: `${apiProject.name}:`,
    hospitalName: apiProject.name,
    website: apiProject.websiteUrl || '#',
    bio: apiProject.bio || '',
    logo: apiProject?.logo || '',
    description: apiProject.description || '',
    coverImage: apiProject.coverImage || undefined,
    dynamicSections: sections.map((s) => ({
      heading: s.heading,
      description: s.description,
    })),
  };
};

export default function AppointmentSystemUI({ params }: any) {
  const componentRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<TransformedData | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

const handlePrintToPDF = useCallback(() => {
  if (componentRef.current) {
    const content = componentRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${data?.hospitalName || 'Case Study'}</title>
            <style>
              /* Add any necessary styles here */
              body {
                font-family: system-ui, -apple-system, sans-serif;
                margin: 0;
                padding: 0;
                color: #1f2937;
              }
              /* Add more styles as needed */
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();

      // Wait for the content to load before triggering print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  }
}, [data?.hospitalName]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/projects?id=${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const apiData: ApiResponse = await response.json();

        if (!apiData.success) {
          throw new Error('API request was not successful');
        }

        const project = apiData.data?.find((p: ApiProject) =>
          p.name.toLowerCase().includes('sarvodaya') ||
          p.name.toLowerCase().includes('hospital')
        ) || apiData.data?.[0];

        if (project) {
          const transformedData = transformApiData(project);
          setData(transformedData);
        } else {
          throw new Error('No project data found');
        }
      } catch (err: any) {
        console.error('Error fetching project data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [params.id]);

  const renderContent = (content: string, heading: string) => {
    const listSections = ['facilities for doctor', 'for patients', 'facilities for appointment'];
    const shouldFormatAsList = listSections.some(section => heading.toLowerCase().includes(section));

    if (shouldFormatAsList) {
      const lines = content.split('\n').filter(line => line.trim());
      return (
        <ul className="space-y-1 text-[0.91rem] leading-[1.45rem] tracking-tight">
          {lines.map((line, index) => {
            const cleanLine = line.replace(/^[-•\u2022*]\s*/, '').trim();
            return cleanLine ? (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{cleanLine}</span>
              </li>
            ) : null;
          })}
        </ul>
      );
    } else {
      return (
        <div
          className="section text-[0.91rem] leading-[1.45rem] tracking-tight text-justify"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading project data...</div>;
  }

  if (error || !data) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error || 'No data available'}</div>;
  }

  return (
    <div className="font-sans bg-white text-gray-800 max-w-6xl mx-auto m-2">
      {!editing ? (
        <div>
          {/* <div className="flex justify-end p-4 print:hidden">
            <button onClick={handlePrintToPDF} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
              Download PDF
            </button>
          </div> */}

          <div ref={componentRef} className="print-container">
            <div className="relative h-[90vh] w-full bg-cover bg-center bg-no-repeat mb-10" style={{ backgroundImage: `url(${data.coverImage})` }}>
              {data.coverImage && <Image src={data.coverImage} alt="Cover" fill className="object-cover z-10" unoptimized />}
              <div className="absolute inset-0 bg-transparent z-50 flex flex-col justify-center items-start p-10 pl-0">
                <h1 className="text-4xl text-white bg-green-500/70 p-5 z-50 font-semibold">{data.title}</h1>
                <div className="mt-4">
                  {data.logo && <Image src={data.logo} className="ml-10 rounded-full outline outline-green-300" alt="Logo" width={80} height={80} unoptimized />}
                  <p className="text-blue-600 font-bold mt-2 text-lg ml-10">{data.hospitalName}</p>
                </div>
              </div>
            </div>

            <div className="columns-2 gap-8">
              <div className="section">
                <div dangerouslySetInnerHTML={{ __html: data.description }} />
              </div>

              {data.website && data.website !== '#' && (
                <div className="mb-4">
                  <a href={data.website} className="text-blue-500 underline text-lg" target="_blank" rel="noopener noreferrer">{data.website}</a>
                </div>
              )}

              {data.bio && (
                <div className="bg-green-100 p-6 mt-6 rounded-md font-serif break-inside-avoid section">
                  <div className="text-[0.91rem] leading-[1.45rem] tracking-tight text-justify" dangerouslySetInnerHTML={{ __html: data.bio }} />
                </div>
              )}

              {data.dynamicSections.map((section, index) => (
                <div key={index} className="mt-8 section">
                  <h2 className="text-xl font-semibold text-sky-700 mb-3">{section.heading}</h2>
                  {renderContent(section.description, section.heading)}
                </div>
              ))}
            </div>

            <footer className="mt-12 mb-5 border-t pt-4 flex justify-between text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 rounded-full border-gray-400"></div>
                <span>GENNEXT IT SOLUTIONS</span>
              </div>
              <span className="uppercase">Case Study</span>
            </footer>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-4 m-2">
          <textarea
            value={JSON.stringify(data, null, 2)}
            onChange={(e) => {
              try {
                setData(JSON.parse(e.target.value));
              } catch (err) {
                console.error('Invalid JSON:', err);
              }
            }}
            className="w-full h-[600px] border p-4 rounded-lg font-mono"
          />
          <button onClick={() => setEditing(false)} className="bg-green-600 text-white px-6 py-2 rounded-lg">
            Save & Preview
          </button>
        </div>
      )}
    </div>
  );
}
