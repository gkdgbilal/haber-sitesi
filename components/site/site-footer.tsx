import Link from "next/link";

export function SiteFooter({
  siteName,
  tagline,
  contactEmail,
  twitterUrl,
  facebookUrl,
  instagramUrl,
  categories,
}: {
  siteName: string;
  tagline: string;
  contactEmail?: string | null;
  twitterUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  categories: { name: string; slug: string }[];
}) {
  const socialLinks = [
    { label: "X / Twitter", url: twitterUrl },
    { label: "Facebook", url: facebookUrl },
    { label: "Instagram", url: instagramUrl },
  ].filter((link) => link.url);

  return (
    <footer className="mt-16 border-t border-site-border bg-site-bg text-site-ink">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">{siteName}</p>
          <p className="mt-2 max-w-xs text-sm text-site-ink-muted">{tagline}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-site-ink-muted">
            Kategoriler
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/kategori/${category.slug}`} className="hover:text-site-accent">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-site-ink-muted">
            İletişim
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {contactEmail ? (
              <li>
                <a href={`mailto:${contactEmail}`} className="hover:text-site-accent">
                  {contactEmail}
                </a>
              </li>
            ) : null}
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.url ?? "#"} target="_blank" rel="noreferrer" className="hover:text-site-accent">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-site-border px-4 py-4 text-center text-xs text-site-ink-muted">
        © {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
