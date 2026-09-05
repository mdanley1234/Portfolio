import Link from "next/link"
import Image from "next/image"
import { getProjects } from '@/lib/getProjects';
import Tag from '@/lib/Tag';

export default function ProjectsPage() {
  // Same order as the homepage carousel and the next-project link on a detail
  // page: frontmatter `rank`, not the order readdir happens to return.
  const projects = getProjects().sort(
    (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity)
  );

  return (
    <main className="min-h-screen background">
      <div className="max-w-5xl mx-auto p-6 py-16">
        <h1 className="text-4xl font-bold mb-8 text-white">Projects</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="card-background border border-white/20 hover:border-white/50 rounded-lg overflow-hidden transition-colors"
            >
              {project.coverImage && (
                <div className="relative w-full h-48">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 92vw, 46vw"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{project.summary}</p>

                {project.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tags.map((tag: string) => (
                      <Tag key={tag} name={tag} />
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
