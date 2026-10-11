const links = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/#contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-parchment px-5 py-14 text-sm text-plum">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-2xl text-ink">
            SetuHome <span className="font-devanagari text-sm text-plum">· सेतु</span>
          </p>
          <p className="mt-1 font-serif text-base italic">A bridge between homes.</p>
        </div>
        <nav className="flex flex-wrap gap-5">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-2 text-xs sm:flex-row sm:justify-between">
        <p>Made with love in India for families everywhere.</p>
        <p>
          © 2026 SetuHome <span className="ml-3 font-serif text-vermilion">शान्तिः शान्तिः शान्तिः</span>
        </p>
      </div>
    </footer>
  );
}
