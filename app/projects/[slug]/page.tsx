// app/projects/[slug]/page.tsx
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import Image from "next/image"
import type { Metadata } from "next"
import DemoBanner from "@/mdx-components/DemoBanner"

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
    <main className="max-w-4xl mx-auto p-6">
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
  )
}