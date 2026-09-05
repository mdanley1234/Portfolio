/**
 * The numbers a project is judged on, pulled out of the prose and into one
 * scannable block under the lede. Frontmatter `facts` is a list of
 * `{ label, value }` pairs; a project without the field renders nothing and
 * keeps its narrative as-is.
 */
export default function ProjectFacts({
  facts = [],
}: {
  facts?: { label: string; value: string }[];
}) {
  if (facts.length === 0) return null;

  return (
    <section aria-labelledby="project-facts" className="mt-12">
      <h2
        id="project-facts"
        className="text-xs font-medium uppercase tracking-[0.18em] text-white/45"
      >
        Specifications
      </h2>

      <dl className="mt-4 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="grid gap-x-6 gap-y-1 px-5 py-4 sm:grid-cols-[minmax(0,11rem)_1fr] md:px-6"
          >
            <dt className="text-sm text-white/50">{fact.label}</dt>
            <dd className="text-sm leading-relaxed text-white md:text-base">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
