
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { ProjectsTable, type NewProject } from '@/db/schema';
import { z } from 'zod';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  userId: z.string().uuid('Valid user ID required'),
  contentJson: z.object({
    sections: z.array(z.object({
      id: z.string(),
      heading: z.string(),
      description: z.string(),
      order: z.number().optional(),
    })),
    metadata: z.object({
      version: z.string().optional(),
      lastModified: z.string().optional(),
    }).optional(),
  }).optional(),
});



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Debug: Log the incoming request body
    console.log('Incoming request body:', body);
    
    const validatedData = createProjectSchema.parse(body);

    const newProject: NewProject = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const [createdProject] = await db
      .insert(ProjectsTable)
      .values(newProject)
      .returning();

    return NextResponse.json({
      success: true,
      data: createdProject,
      message: 'Project created successfully',
    });

  } catch (error) {
    console.error('Error creating project:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create project',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const Id = searchParams.get('id');

    let data :any = db.select().from(ProjectsTable);

    if(userId){
      data = db.select().from(ProjectsTable).where(eq(ProjectsTable.userId,userId))
    }
    if(Id){
      data = db.select().from(ProjectsTable).where(eq(ProjectsTable.id,Id))
    }
  
   
    // If no filters, get all projects

    const projects = await data.orderBy(desc(ProjectsTable.createdAt));

    return NextResponse.json({
      success: true,
      data: projects,
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch projects',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}