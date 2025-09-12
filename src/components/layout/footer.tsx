
'use client';

import Link from "next/link";

export function AppFooter() {
    return (
        <footer className="border-t py-4 px-6 text-sm text-muted-foreground bg-background/30 backdrop-blur-lg">
            <div className="flex items-center justify-between">
                <p>&copy; {new Date().getFullYear()} Bhumicare. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <Link href="#" className="hover:text-primary">Privacy Policy</Link>
                    <Link href="#" className="hover:text-primary">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
