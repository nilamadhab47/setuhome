export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-parchment/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 lg:h-20 lg:px-8">
        <a href="/" className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-marigold" aria-hidden>
            <Lotus />
          </span>
          <span className="truncate font-serif text-xl text-ink sm:text-2xl">SetuHome</span>
          <span className="shrink-0 font-devanagari text-sm text-plum">· सेतु</span>
        </a>
        <a
          href="/#waitlist"
          className="rounded-full bg-marigold px-4 py-2 text-sm font-medium text-ink hover:bg-marigold-deep"
        >
          Join
        </a>
      </div>
    </header>
  );
}

function Lotus() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 21c-4-4-8-7.5-8-11a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 3.5-4 7-8 11Z" />
      <path d="M12 21V10" />
    </svg>
  );
}
