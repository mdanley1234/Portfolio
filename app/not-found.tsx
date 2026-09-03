import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen background flex items-center justify-center">
      <div className="container mx-auto px-6 py-24 text-center">
        <p className="text-gray-500 mb-3">404</p>
        <h1 className="text-4xl font-bold text-white mb-4">
          This page doesn&rsquo;t exist
        </h1>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">
          The link may be out of date, or the project may have been renamed.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-white/85 transition-colors"
          >
            Back home
          </Link>
          <Link
            href="/#projects"
            className="px-8 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
          >
            Browse projects
          </Link>
        </div>
      </div>
    </main>
  )
}
