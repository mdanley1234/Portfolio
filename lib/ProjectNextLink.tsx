import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

/**
 * The foot of a project page. A detail page is otherwise a dead end — the only
 * way on is the header's Back link — so it closes by handing the reader the
 * next project in the same order the homepage carousel uses, wrapping around
 * at the end of the list.
 */
export default function ProjectNextLink({
  project,
}: {
  project: { slug: string; title: string; summary?: string; coverImage?: string | null };
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group mt-20 flex items-center gap-5 rounded-2xl border border-white/15 card-background p-4 transition-colors hover:border-white/45 hover:bg-[#242424] focus-visible:border-white/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:gap-6 md:p-5"
    >
      {project.coverImage && (
        <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-xl bg-white/10 sm:block md:size-28">
          <Image
            src={project.coverImage}
            alt=""
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
          Next project
        </p>
        <p className="mt-1.5 text-xl font-semibold text-white md:text-2xl">
          {project.title}
        </p>
        {project.summary && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/60">
            {project.summary}
          </p>
        )}
      </div>

      <ArrowRight
        aria-hidden
        className="size-5 shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
      />
    </Link>
  );
}
