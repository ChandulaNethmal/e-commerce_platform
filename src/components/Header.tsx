"use client";

import Link from "next/link";
import { Flower2, Menu, User, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/hooks";
import { CartSheet } from "./CartSheet";
import { Badge } from "./ui/badge";
import { useCart } from "@/lib/hooks";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react";

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#catalog", label: "Shop" },
    { href: "/recommendations", label: "AI Helper" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  }

  const NavContent = () => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} asChild variant="ghost" onClick={handleLinkClick}>
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Flower2 className="h-6 w-6 text-primary" />
          <span className="font-headline text-2xl font-bold">BloomNext</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <NavContent />
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <CartSheet>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{itemCount}</Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </CartSheet>

          {!isLoading && (
            <>
              {user ? (
                <>
                  <span className="hidden sm:inline text-sm">Welcome, {user}</span>
                  <Button variant="outline" onClick={logout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="hidden sm:inline-flex">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 pt-8">
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
