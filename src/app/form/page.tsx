/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCurrentUser } from "@/hooks/auth";
import { useProjects } from "@/hooks/useProjects";
import { Plus, Save, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";

interface Section {
  id: string;
  heading: string;
  description: string;
  order: number;
}

interface FormValues {
  name: string;
  description: string;
  bio: string;
  websiteUrl: string;
  slug: string;
  logo: string;
  coverImage: string;
  status: string;
  sections: Section[];
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export default function CreateProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const { createProject } = useProjects();
  const user = useCurrentUser();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      bio: "",
      websiteUrl: "",
      slug: "",
      logo: "",
      coverImage: "",
      status: "DRAFT",
      sections: [
        {
          id: crypto.randomUUID(),
          heading: "",
          description: "",
          order: 1,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const projectName = watch("name");
  React.useEffect(() => {
    if (projectName) {
      const slug = generateSlug(projectName);
      setValue("slug", slug);
    }
  }, [projectName, setValue]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const projectData: any = {
        name: data.name,
        description: data.description,
        bio: data.bio,
        websiteUrl: data.websiteUrl,
        slug: data.slug,
        logo: data.logo || logoPreview || undefined,
        coverImage: data.coverImage || coverPreview || undefined,
        status: data.status,
        userId: user?.id,
        contentJson: {
          sections: data.sections,
          metadata: {
            version: "1.0",
            lastModified: new Date().toISOString(),
          },
        },
      };

      const newProject = await createProject(projectData);

      reset();
      setLogoPreview(null);
      setCoverPreview(null);
      alert("Project created successfully!");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSection = () => {
    append({
      id: crypto.randomUUID(),
      heading: "",
      description: "",
      order: fields.length + 1,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h2>
        <p className="text-gray-600">Fill in the details to create your project</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL-friendly name)</label>
              <input
                {...register("slug")}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="project-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input
                {...register("websiteUrl")}
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Describe the project"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              {...register("bio")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Short bio"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <div className="flex items-center space-x-4">
                {logoPreview && (
                  <div className="w-16 h-16 relative rounded-md overflow-hidden">
                    <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                  </div>
                )}
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const url = res?.[0]?.url;
                    if (url) {
                      setLogoPreview(url);
                      setValue("logo", url);
                    }
                  }}
                  onUploadError={(error: Error) => alert(`Upload error: ${error.message}`)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
              <div className="flex items-center space-x-4">
                {coverPreview && (
                  <div className="w-24 h-16 relative rounded-md overflow-hidden">
                    <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                  </div>
                )}
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const url = res?.[0]?.url;
                    if (url) {
                      setCoverPreview(url);
                      setValue("coverImage", url);
                    }
                  }}
                  onUploadError={(error: Error) => alert(`Upload error: ${error.message}`)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Content Sections</h3>
            <button
              type="button"
              onClick={addSection}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium">Section {index + 1}</h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heading *</label>
                    <input
                      {...register(`sections.${index}.heading` as const)}
                      type="text"
                      className="w-full px-4 py-2 border rounded-md"
                      placeholder="Section heading"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      {...register(`sections.${index}.description` as const)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Section description"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => {
              reset();
              setLogoPreview(null);
              setCoverPreview(null);
            }}
            className="px-6 py-2 border text-gray-700 rounded-md hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
