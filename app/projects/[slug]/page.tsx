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
import ImageSlideshow from "@/mdx-components/ImageSlideshow"
import MdxImage from "@/mdx-components/MdxImage"
import MdxEmbed from "@/mdx-components/MdxEmbed"
import remarkMdxElements from "@/lib/remark-mdx-elements.mjs"
import ProjectHero from "@/lib/ProjectHero"
import ProjectFacts from "@/lib/ProjectFacts"
import ProjectNextLink from "@/lib/ProjectNextLink"
import MachDiamonds from "@/lib/MachDiamonds"
import { getProjects } from "@/lib/getProjects"
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
  DemoBanner,
  CADViewer,
  ImageSlideshow,
  // Every image in project content renders through next/image; every embed
  // loads lazily. remarkMdxElements rewrites literal <img>/<iframe> tags to
  // these, since MDX does not route lowercase JSX through this map on its own.
  img: MdxImage,
  MdxImage,
  MdxEmbed,
  // Wide tables scroll inside their own box instead of widening the page.
  table: (props: React.ComponentProps<"table">) => (
    <div className="table-scroll">
      <table {...props} />
    </div>
  ),
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

  // Read slug.mdx and take the body; the frontmatter is read by generateMetadata
  const source = fs.readFileSync(filePath, "utf8")
  const { content, data } = matter(source)

  // Opt-in per project: `layout: feature` in the frontmatter swaps the plain
  // heading-first article for the banner-led layout below. Projects without
  // it render exactly as they always have.
  const isFeature = data.layout === "feature"
  const heroImage = String(data.heroImage ?? data.coverImage ?? "")
  const facts = Array.isArray(data.facts) ? data.facts : []

  // The next project in the same order the homepage carousel uses, wrapping
  // around so the last project still leads somewhere.
  const ordered = getProjects().sort(
    (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity)
  )
  const here = ordered.findIndex((p) => p.slug === slug)
  const next = ordered.length > 1 ? ordered[(here + 1) % ordered.length] : null

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
        </nav>
      </header>

      {/* Main Content */}
      <main
        className={`relative z-10 ${isFeature ? "" : "max-w-4xl mx-auto mt-30"}`}
      >
        {isFeature && heroImage && (
          <ProjectHero
            title={String(data.title ?? slug)}
            tagline={
              data.tagline || data.summary
                ? String(data.tagline ?? data.summary)
                : undefined
            }
            start={data.start ? String(data.start) : undefined}
            end={data.end ? String(data.end) : undefined}
            heroImage={heroImage}
            heroAlt={String(data.heroAlt ?? "")}
            heroPosition={data.heroPosition ? String(data.heroPosition) : undefined}
            heroScale={data.heroScale ? Number(data.heroScale) : undefined}
            tags={Array.isArray(data.tags) ? data.tags : []}
          />
        )}

        <div className={isFeature ? "max-w-4xl mx-auto px-6 pb-4" : ""}>
          {isFeature && data.lede && (
            <p className="text-pretty text-lg leading-relaxed text-white/85 md:text-2xl md:leading-relaxed">
              {String(data.lede)}
            </p>
          )}

          {isFeature && <ProjectFacts facts={facts} />}

          <article
            className={`prose prose-invert lg:prose-lg max-w-none${
              isFeature ? " mt-16 border-t border-white/10 pt-14" : ""
            }`}
          >
            {/* Generate MDX file */}
            <MDXRemote
              source={content}
              components={components}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkMdxElements],
                  rehypePlugins: [rehypeHighlight],
                },
              }}
            />
          </article>

          {isFeature && next && <ProjectNextLink project={next} />}
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`relative py-10 border-t border-white/20 ${
          isFeature ? "mt-16" : "mt-24"
        }`}
      >
        {/* bottom-full puts the field's cut edge exactly on the footer's top
            border, so the plume rises out of the rule that closes the page.
            Anchored to the footer rather than to the article, whose height
            varies from project to project. `main` carries z-10 so this stays
            behind the content it reaches up over. */}
        <MachDiamonds className="pointer-events-none absolute inset-x-0 bottom-full z-0" />
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2025 Michael Danley. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}