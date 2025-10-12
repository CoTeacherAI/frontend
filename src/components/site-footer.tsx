import Link from "next/link";
import { Github, Linkedin, Mail, X as Twitter } from "lucide-react";

type NavLink = { label: string; href: string; external?: boolean };

const product: NavLink[] = [
  { label: "Overview", href: "/product" },
  { label: "Pricing", href: "/pricing" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Changelog", href: "/changelog" },
];

const resources: NavLink[] = [
  { label: "Docs", href: "/docs" },
  { label: "API", href: "/api" },
  { label: "Guides", href: "/guides" },
  { label: "Community", href: "/community" },
];

const company: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const legal: NavLink[] = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "DPA", href: "/legal/dpa" },
];

function Section({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            {l.external ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-slate-100"
              >
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="text-sm text-slate-400 hover:text-slate-100">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-slate-950/70 backdrop-blur">
      {/* Accent line */}
      <div className="pointer-events-none absolute -top-px left-0 h-px w-full bg-gradient-to-r from-cyan-400/0 via-cyan-400/60 to-cyan-400/0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: brand + newsletter */}
        <div className="grid gap-8 py-12 md:grid-cols-12">
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900">
                <span className="font-bold">CT</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-100">
                CoTeacher&nbsp;AI
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              CoTeacher AI helps instructors and students collaborate with an AI that’s grounded in
              your course materials.
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://x.com/"
                aria-label="X"
                className="rounded-full border border-white/15 p-2 text-slate-300 hover:border-white/40 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/"
                aria-label="GitHub"
                className="rounded-full border border-white/15 p-2 text-slate-300 hover:border-white/40 hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/"
                aria-label="LinkedIn"
                className="rounded-full border border-white/15 p-2 text-slate-300 hover:border-white/40 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <Link
                href="/contact"
                aria-label="Contact"
                className="rounded-full border border-white/15 p-2 text-slate-300 hover:border-white/40 hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
              <Section title="Product" links={product} />
              <Section title="Resources" links={resources} />
              <Section title="Company" links={company} />
              <Section title="Legal" links={legal} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} CoTeacher AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/status" className="hover:text-slate-100">
              Status
            </Link>
            <Link href="/sitemap" className="hover:text-slate-100">
              Sitemap
            </Link>
            <Link href="/legal/privacy" className="hover:text-slate-100">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-slate-100">
              Terms
            </Link>
          </div>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
    </footer>
  );
}
