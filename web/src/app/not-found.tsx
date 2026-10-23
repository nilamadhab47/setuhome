import Link from "next/link";

export default function NotFound() {
  return (
    <article className="mx-auto max-w-2xl px-5 pt-32 pb-24">
      <p className="text-xs tracking-widest text-marigold uppercase">Missing page</p>
      <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">This page is not here.</h1>
      <p className="mt-4 text-plum">The home page still is.</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-marigold px-6 py-3 text-sm font-medium text-ink hover:bg-marigold-deep"
      >
        Back to SetuHome
      </Link>
    </article>
  );
}
