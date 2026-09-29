"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        {/* Logo */}
        <div>
          <h2 className="text-2xl font-bold">NexCart</h2>
        </div>

        {/* Navigation Links */}
        <div className="hidden items-center gap-6 md:flex">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/wishlist" className="flex items-center gap-1">
            <Heart size={18} />
            Wishlist
          </a>          <a href="/cart" className="flex items-center gap-1">
            <ShoppingCart size={18} />
            Cart
          </a>
        </div>

        {/* User Action */}
        <div>
          <a href="/login">Login</a>
        </div>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="border-t px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/wishlist">Wishlist</a>
            <a href="/cart">Cart</a>
            <a href="/login">Login</a>
          </div>
        </div>
      )}
    </nav>
  );
}