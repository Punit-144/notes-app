"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-background">
      <div className="max-w-4xl mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="text-xl font-semibold">
          Notes App
        </Link>

        <Button asChild>
          <Link href="/create">New Note</Link>
        </Button>
      </div>
    </nav>
  );
}
