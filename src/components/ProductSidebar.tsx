"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  LayoutDashboard,
  BookOpen,
  Presentation,
  FileText,
  Settings,
  HelpCircle,
  ChevronRight,
  MessageSquare,
  GraduationCap,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useMemo } from "react";

const products = [
  {
    name: "CoTeacher",
    href: "/products/coteacher/app",
    icon: MessageSquare,
    color: "orange",
  },
  {
    name: "ClassPark",
    href: "/products/classpark/app",
    icon: FileText,
    color: "orange",
  },
  {
    name: "SlidesDeck",
    href: "/products/slidesdeck",
    icon: Presentation,
    color: "amber",
  },
];

export function ProductSidebar() {
  const pathname = usePathname();
  const { user, userRole } = useAuth();
  const { isMinimized, toggleSidebar } = useSidebar();

  // Only show sidebar when logged in and inside a product
  const shouldShow = useMemo(() => {
    if (!user) return false;
    return pathname?.startsWith("/products/");
  }, [user, pathname]);

  // Determine current product - must be called before any conditional returns
  const currentProduct = useMemo(() => {
    if (pathname?.startsWith("/products/coteacher")) return "CoTeacher";
    if (pathname?.startsWith("/products/classpark")) return "ClassPark";
    if (pathname?.startsWith("/products/slidesdeck")) return "SlidesDeck";
    return null;
  }, [pathname]);

  // Early return after all hooks are called
  if (!shouldShow) return null;

  // Product-specific navigation
  const getProductNav = () => {
    if (currentProduct === "CoTeacher") {
      const baseNav = [
        {
          name: "Dashboard",
          href: "/products/coteacher/app",
          icon: LayoutDashboard,
        },
      ];

      if (userRole === "professor") {
        return [
          ...baseNav,
          {
            name: "My Courses",
            href: "/products/coteacher/professor",
            icon: GraduationCap,
          },
        ];
      } else {
        return [
          ...baseNav,
          {
            name: "My Courses",
            href: "/products/coteacher/student",
            icon: BookOpen,
          },
        ];
      }
    }

    if (currentProduct === "ClassPark") {
      return [
        {
          name: "Dashboard",
          href: "/products/classpark/app",
          icon: LayoutDashboard,
        },
        {
          name: "My Recordings",
          href: "/products/classpark/professor",
          icon: FileText,
        },
      ];
    }

    if (currentProduct === "SlidesDeck") {
      return [
        {
          name: "Dashboard",
          href: "/products/slidesdeck",
          icon: LayoutDashboard,
        },
        {
          name: "My Presentations",
          href: "/products/slidesdeck",
          icon: Presentation,
        },
      ];
    }

    return [];
  };

  const productNav = getProductNav();
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <>
      <aside 
        className={`hidden lg:block fixed left-0 top-28 bottom-0 border-r border-stone-200/60 bg-white/80 backdrop-blur-xl z-40 overflow-hidden transition-all duration-300 ${
          isMinimized ? "w-0" : "w-64"
        }`}
      >
        <div className={`flex flex-col h-full transition-opacity duration-300 ${isMinimized ? "opacity-0 pointer-events-none" : "opacity-100"} overflow-y-auto`}>

        {/* Product Switcher */}
        <div className="p-4 border-b border-stone-200/60">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-600 mb-3 px-2">
            Products
          </div>
          <div className="space-y-1">
            {products.map((product) => {
              const Icon = product.icon;
              const isCurrent = currentProduct === product.name;
              return (
                <Link
                  key={product.name}
                  href={product.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isCurrent
                      ? "bg-orange-50 border border-orange-200/60 text-orange-700"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isCurrent ? "text-orange-500" : "text-stone-500"}`} />
                  <span className="text-sm font-medium flex-1">{product.name}</span>
                  {isCurrent && <ChevronRight className="h-4 w-4 text-orange-500" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Product Navigation */}
        {currentProduct && productNav.length > 0 && (
          <div className="flex-1 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-stone-600 mb-3 px-2">
              Navigation
            </div>
            <nav className="space-y-1">
              {productNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                      active
                        ? "bg-orange-50 border border-orange-200/60 text-orange-700"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-orange-500" : "text-stone-500"}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-200/60 space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50 transition"
          >
            <Settings className="h-4 w-4 text-stone-500" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <Link
            href="/help"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50 transition"
          >
            <HelpCircle className="h-4 w-4 text-stone-500" />
            <span className="text-sm font-medium">Help</span>
          </Link>
        </div>
      </div>
      </aside>
      
      {/* Minimize button - always visible */}
      <div className="hidden lg:block fixed left-0 top-28 z-50">
        <button
          onClick={toggleSidebar}
          className={`rounded-r-lg bg-white border border-stone-200/60 border-l-0 shadow-lg p-2 hover:bg-stone-50 transition-all duration-300 ${
            isMinimized ? "translate-x-0" : "translate-x-64"
          }`}
          aria-label={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
        >
          {isMinimized ? (
            <ChevronRightIcon className="h-4 w-4 text-stone-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-stone-600" />
          )}
        </button>
      </div>
    </>
  );
}

