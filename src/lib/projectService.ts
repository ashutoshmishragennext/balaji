// ===== 4. PROJECT SERVICE (lib/projectService.ts) =====

import { ProjectsTable, type NewProject, type Project } from '@/db/schema';
import { db } from '@/db';

import { eq, desc } from 'drizzle-orm';

export class ProjectService {
  static async createProject(projectData: NewProject): Promise<Project> {
    const [createdProject] = await db
      .insert(ProjectsTable)
      .values(projectData)
      .returning();
    
    return createdProject;
  }

  static async getProjectsByUserId(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(ProjectsTable)
      .where(eq(ProjectsTable.userId, userId))
      .orderBy(desc(ProjectsTable.createdAt));
  }

  static async getProjectBySlug(slug: string): Promise<Project | null> {
    const [project] = await db
      .select()
      .from(ProjectsTable)
      .where(eq(ProjectsTable.slug, slug))
      .limit(1);
    
    return project || null;
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const [updatedProject] = await db
      .update(ProjectsTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(ProjectsTable.id, id))
      .returning();
    
    return updatedProject;
  }
}