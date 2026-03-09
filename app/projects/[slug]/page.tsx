// app/projects/[slug]/page.tsx
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import type { Metadata } from "next"
import DemoBanner from "@/mdx-components/DemoBanner"
import CADViewer from "@/mdx-components/CADViewer"
import Link from "next/link"
import { Menu } from "lucide-react"

type Props = { params: Promise<{ slug: string }> }
const CONTENT_DIR = path.join(process.cwd(), "content", "projects")

export async function generateStaticParams() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"))
  return files.map((f) => ({ slug: f.replace(/\.mdx$/, "") }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return {}
  const source = fs.readFileSync(filePath, "utf8")
  const { data } = matter(source)
  return {
    title: String(data.title ?? `Project: ${slug}`),
    description: String(data.summary ?? ""),
    openGraph: {
      title: String(data.title ?? ""),
      description: String(data.summary ?? ""),
      images: data.coverImage ? [String(data.coverImage)] : undefined,
    },
  }
}

const components = {
  // Insert MDX Components here
  DemoBanner,
  CADViewer
}

// Returns ProjectPage object with { params } containing mdx slug
export default async function ProjectPage({ params }: Props) {
  // Build filePath using slug from params
  const { slug } = await params
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)

  // If slug cannot be found, generate error page
  if (!fs.existsSync(filePath)) {
    return <main className="max-w-4xl mx-auto p-6">Project not found</main>
  }

  // Read slug.mdx file and seperate between content and data using gray-matter
  const source = fs.readFileSync(filePath, "utf8")
  const { content, data } = matter(source)

  // Generate and return page
  return (
    <div className="min-h-screen background">


      {/* Sticky Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-4 sm:px-6
        py-2 md:py-3 lg:py-3
        min-h-[56px] md:min-h-[72px]
        transition-all duration-300"
        style={{
          willChange: 'transform',
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)'
        }}
      >

        {/* Navbar */}
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">

          {/* Navbar Left */}
          <a
            className="text-xl tracking-wider mb-6"
            href={'/'}
          >
            <span className="text-white font-semibold">
              Michael Danley
            </span>
          </a>

          {/* Back Button */}
          <Link
            href="/#projects"
            className="text-black hover:opacity-85 transition-opacity px-4 py-2 rounded-full bg-white border border-white/20"
          >
            Back
          </Link>

          {/* TODO: Add expanding menu for mobile devices */}
          <button
            className="md:hidden text-gray-400"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-30">
        <article className="prose prose-invert lg:prose-lg max-w-none">
          {/* Generate MDX file */}
          <MDXRemote
            source={content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeHighlight],
              },
            }}
          />
        </article>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-white/20 mt-24">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2025 Michael Danley. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}