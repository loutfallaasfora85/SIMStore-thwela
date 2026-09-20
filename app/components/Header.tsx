"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const pathname = usePathname();

  // Close menu on route change or resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-outline-variant/30">
      <nav className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.webp" alt="برج المبدع للأجهزة المنزلية" width={44} height={44} className="rounded-lg" />
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex gap-6 items-center">
          {[
            { href: "/", label: "الرئيسية" },
            { href: "/products", label: "المنتجات" },
            { href: "/about", label: "من نحن" },
            { href: "/contact", label: "تواصل معنا" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors pb-0.5 ${
                pathname === href
                  ? "text-secondary font-semibold border-b-2 border-secondary"
                  : "text-on-surface-variant hover:text-secondary hover:border-b-2 hover:border-secondary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search - Desktop only */}
          
          {/* Cart */}
          <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 hover:bg-secondary/10 rounded-full transition-all">
            <span className="material-symbols-outlined text-secondary">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 hover:bg-secondary/10 rounded-full transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            <span className="material-symbols-outlined text-on-surface">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu with animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-outline-variant/30 px-4 py-4 flex flex-col gap-4">
          {/* Mobile Search */}
          <div className="relative">
            <input
              className="bg-surface-container-low rounded-full px-4 py-2 w-full text-sm focus:ring-2 focus:ring-secondary/40 focus:outline-none placeholder:text-outline border border-outline-variant/40"
              placeholder="بحث عن منتج..."
              type="text"
            />
            <span className="material-symbols-outlined absolute left-3 top-2 text-outline text-[20px]">search</span>
          </div>
          {[
            { href: "/", label: "الرئيسية" },
            { href: "/products", label: "المنتجات" },
            { href: "/about", label: "من نحن" },
            { href: "/contact", label: "تواصل معنا" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm ${pathname === href ? "text-secondary font-semibold" : "text-on-surface-variant"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
