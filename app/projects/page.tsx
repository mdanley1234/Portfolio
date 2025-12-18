import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Link from "next/link"
import Image from "next/image"
import { getProjects } from '@/lib/getProjects';

export default function ProjectsPage() {
  const projects = getProjects(); // NOTE: Add "await" getProjects() for async

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            {project.coverImage && (
              <div className="relative w-full h-48">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-4">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="text-zinc-600 text-sm mt-1">{project.summary}</p>

              {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-zinc-100 border rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
