// ===== 5. FORM VALIDATION (lib/validations.ts) =====
import { z } from 'zod';

export const projectFormSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  description: z.string().max(50000, 'Description too long').optional(),
    bio: z.string().max(50000, 'Description too long').optional(),

  logo: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  coverImage: z.string().url('Invalid cover image URL').optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  sections: z.array(z.object({
    id: z.string(),
    heading: z.string().min(1, 'Heading is required'),
    description: z.string().min(1, 'Description is required'),
    order: z.number().optional(),
  })).min(1, 'At least one section is required'),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;