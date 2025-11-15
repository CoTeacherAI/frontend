"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

const resources = [
  { name: "Documentation", href: "/resources/docs", description: "API docs and guides" },
  { name: "Help Center", href: "/resources/help", description: "Get support and answers" },
  { name: "Blog", href: "/resources/blog", description: "Latest news and updates" },
  { name: "Community", href: "/resources/community", description: "Join our community" },
];

export function Navbar() {
  const router = useRouter();
  const { user, username, loading, signOut } = useAuth();

  // Products - always link to landing pages
  const products = [
    { 
      name: "ClassPark", 
      href: "/products/classpark", 
      description: "Post-lecture notes, glossary & quiz to LMS"
    },
    { 
      name: "SlidesDeck", 
      href: "/products/slidesdeck", 
      description: "Presentation builder & generation studio"
    },
    { 
      name: "CoTeacher", 
      href: "/products/coteacher", 
      description: "AI-powered learning assistant"
    },
  ];
  const [productsOpen, setProductsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const homeHref = user ? "/products/coteacher/app" : "/";

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-full border border-stone-200/60 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-4 py-2.5">
          {/* Left side: Logo */}
          <Link href={homeHref} className="flex-shrink-0 font-semibold tracking-tight text-stone-900">
            <span className="text-lg md:text-xl">
              <span className="text-orange-500">Darasa</span>Hub
            </span>
          </Link>

          {/* Center: Navigation items - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {/* Products dropdown */}
            <div className="relative" ref={productsDropdownRef}>
              <button
                onClick={() => {
                  setProductsOpen(!productsOpen);
                  setResourcesOpen(false);
                }}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition"
                aria-expanded={productsOpen}
                aria-haspopup="true"
              >
                Products
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${productsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Products dropdown menu */}
              {productsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-stone-200/60 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] overflow-hidden z-50">
                  <div className="p-2">
                    {products.map((product) => {
                      return (
                        <Link
                          key={product.name}
                          href={product.href}
                          onClick={() => setProductsOpen(false)}
                          className="block rounded-xl px-4 py-3 hover:bg-stone-50 transition group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-stone-900 group-hover:text-orange-500 transition">
                                {product.name}
                              </div>
                              <div className="text-xs text-stone-600 mt-0.5">{product.description}</div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Resources dropdown */}
            <div className="relative" ref={resourcesDropdownRef}>
              <button
                onClick={() => {
                  setResourcesOpen(!resourcesOpen);
                  setProductsOpen(false);
                }}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition"
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
              >
                Resources
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Resources dropdown menu */}
              {resourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-stone-200/60 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] overflow-hidden z-50">
                  <div className="p-2">
                    {resources.map((resource) => (
                      <Link
                        key={resource.name}
                        href={resource.href}
                        onClick={() => setResourcesOpen(false)}
                        className="block rounded-xl px-4 py-3 hover:bg-stone-50 transition group"
                      >
                        <div className="font-semibold text-stone-900 group-hover:text-orange-500 transition">
                          {resource.name}
                        </div>
                        <div className="text-xs text-stone-600 mt-0.5">{resource.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing link */}
            <Link
              href="/pricing"
              className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition"
            >
              Pricing
            </Link>
          </nav>

          {/* Right side: Auth buttons */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-full p-2 text-stone-700 hover:bg-stone-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Desktop auth buttons */}
            <div className="hidden lg:flex items-center gap-2">
              {loading ? (
                <div className="h-9 w-28 rounded-full bg-stone-100 border border-stone-200 animate-pulse" />
              ) : user ? (
                <>
                  <span className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-sm text-stone-700">
                    {username ?? user.email?.split("@")[0] ?? "you"}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="rounded-full px-4 py-2 text-sm border border-stone-300 hover:border-stone-400 text-stone-700 transition flex items-center gap-2"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="rounded-full px-4 py-2 text-sm border border-stone-300 hover:border-stone-400 text-stone-700 transition"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-full px-4 py-2 text-sm bg-orange-500/90 text-slate-900 font-medium hover:bg-orange-400 transition"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden mt-2 rounded-2xl border border-stone-200/60 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <div className="p-2">
              {/* Products section */}
              <div className="mb-2">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-stone-600">
                  Products
                </div>
                {products.map((product) => {
                  return (
                    <Link
                      key={product.name}
                      href={product.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 hover:bg-stone-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-stone-900">{product.name}</div>
                          <div className="text-xs text-stone-600 mt-0.5">{product.description}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Resources section */}
              <div className="mb-2">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-stone-600">
                  Resources
                </div>
                {resources.map((resource) => (
                  <Link
                    key={resource.name}
                    href={resource.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 hover:bg-stone-50 transition"
                  >
                    <div className="font-semibold text-stone-900">{resource.name}</div>
                    <div className="text-xs text-stone-600 mt-0.5">{resource.description}</div>
                  </Link>
                ))}
              </div>

              {/* Pricing link */}
              <div className="mb-2">
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 hover:bg-stone-50 transition"
                >
                  <div className="font-semibold text-stone-900">Pricing</div>
                </Link>
              </div>

              {/* Divider */}
              <div className="my-2 border-t border-stone-200/60" />

              {/* Auth section */}
              {loading ? (
                <div className="px-4 py-2">
                  <div className="h-9 w-full rounded-full bg-stone-100 border border-stone-200 animate-pulse" />
                </div>
              ) : user ? (
                <div className="px-2 space-y-1">
                  <div className="px-3 py-2 rounded-xl bg-stone-50 text-sm text-stone-700">
                    {username ?? user.email?.split("@")[0] ?? "you"}
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-xl px-4 py-2 text-sm border border-stone-300 hover:border-stone-400 text-stone-700 transition flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="px-2 space-y-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center rounded-xl px-4 py-2 text-sm border border-stone-300 hover:border-stone-400 text-stone-700 transition"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center rounded-xl px-4 py-2 text-sm bg-orange-500/90 text-slate-900 font-medium hover:bg-orange-400 transition"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}