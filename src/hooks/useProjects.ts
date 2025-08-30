
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ===== 6. REACT HOOK (hooks/useProjects.ts) =====
import { Project, ProjectContent } from '@/db/schema';
import { useState, useEffect } from 'react';
// import { Project, ProjectContent } from '@/lib/schema';

interface CreateProjectData {
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  userId: string;
  contentJson?: ProjectContent;
}

export function useProjects(userId?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = userId ? `?userId=${userId}` : '';
      const response = await fetch(`/api/projects${params}`);
      const result = await response.json();
      
      if (result.success) {
        setProjects(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: CreateProjectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setProjects(prev => [result.data, ...prev]);
        return result.data;
      } else {
        setError(result.error);
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  return {
    projects,
    loading,
    error,
    createProject,
    refetch: fetchProjects,
  };
}