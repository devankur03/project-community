"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Layers, Home, Compass, LogIn, UserPlus, Upload, Building2, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    SignInButton,
    SignUpButton,
    UserButton,
    useAuth,
    useUser,
} from "@clerk/nextjs";

export function Header() {
    const { isSignedIn } = useAuth();
    const { user, isLoaded: userLoaded } = useUser();
    const isAdmin = userLoaded && (user?.publicMetadata?.isAdmin === true || user?.publicMetadata?.isAdmin === 'true');
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">

                {/* Left — Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 font-semibold text-foreground hover:opacity-80 transition-opacity"
                >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Layers className="size-4" />
                    </span>
                    <span className="font-heading text-lg tracking-tight">Launchpad</span>
                </Link>

                {/* Center — Nav links */}
                <nav className="hidden items-center gap-1 sm:flex">
                    <Link
                        href="/"
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground ${pathname === "/" ? "bg-accent text-foreground" : "text-muted-foreground"}`}
                    >
                        <Home className="size-4" />
                        Home
                    </Link>
                    <Link
                        href="/explore"
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground ${pathname === "/explore" ? "bg-accent text-foreground" : "text-muted-foreground"}`}
                    >
                        <Compass className="size-4" />
                        Explore
                    </Link>
                </nav>

                {/* Right — Auth */}
                <div className="flex items-center gap-2">
                    {!mounted ? (
                        <div className="h-8 w-32 rounded-md bg-muted" />
                    ) : isSignedIn ? (
                        <>
                            <Button size="sm" className="gap-1.5" asChild>
                                <Link href="/submit">
                                    <Upload className="size-4" />
                                    Submit Project
                                </Link>
                            </Button>
                            <UserButton>
                                <UserButton.MenuItems>
                                    {isAdmin && (
                                        <UserButton.Link
                                            label="Admin Dashboard"
                                            labelIcon={<LayoutDashboard className="size-4" />}
                                            href="/admin"
                                        />
                                    )}
                                    <UserButton.Link
                                        label="Manage Organization"
                                        labelIcon={<Building2 className="size-4" />}
                                        href="/organization-profile"
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        </>
                    ) : (
                        <>
                            <SignInButton mode="modal">
                                <Button variant="ghost" size="sm" className="gap-1.5">
                                    <LogIn className="size-4" />
                                    Sign in
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button size="sm" className="gap-1.5">
                                    <UserPlus className="size-4" />
                                    Sign up
                                </Button>
                            </SignUpButton>
                        </>
                    )}
                </div>

            </div>
        </header>
    );
}
