// app/projects/[slug]/page.tsx
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import type { Metadata } from "next"
import DemoBanner from "@/mdx-components/DemoBanner"
import Link from "next/link"

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
  DemoBanner
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
      {/* Header */}
      <header className="max-w-6xl mx-auto py-3 md:py-4 lg:py-4 min-h-[56px] md:min-h-[72px]">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl tracking-wider text-white font-semibold hover:opacity-80 transition-opacity"
          >
            Michael Danley
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/#projects"
              className="text-black hover:opacity-85 transition-opacity px-4 py-2 rounded-full bg-white border border-white/20"
            >
              Back
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
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
    </div>
  )
}