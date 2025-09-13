import { BhumicareLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export function LandingFooter() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto py-12 px-4">
                <div className="grid md:grid-cols-12 gap-8">
                    <div className="md:col-span-4 space-y-4">
                         <Link href="/" className="flex items-center gap-2">
                            <BhumicareLogo className="w-8 h-8 text-primary" />
                            <span className="font-headline text-xl font-semibold">Bhumicare</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">Real-time soil wisdom for every farmer.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary"><Github className="h-5 w-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>
                     <div className="md:col-span-2">
                        <h3 className="font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#solution" className="text-muted-foreground hover:text-primary">Solution</a></li>
                            <li><a href="#impact" className="text-muted-foreground hover:text-primary">Impact</a></li>
                            <li><a href="#how-it-works" className="text-muted-foreground hover:text-primary">How It Works</a></li>
                        </ul>
                    </div>
                     <div className="md:col-span-2">
                        <h3 className="font-semibold mb-4">Company</h3>
                         <ul className="space-y-2 text-sm">
                            <li><a href="#team" className="text-muted-foreground hover:text-primary">About Us</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary">Careers</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
                        </ul>
                    </div>
                     <div className="md:col-span-4 space-y-4">
                        <h3 className="font-semibold">Stay up to date</h3>
                        <p className="text-sm text-muted-foreground">Join our newsletter to get the latest updates.</p>
                        <form className="flex space-x-2">
                            <Input type="email" placeholder="Enter your email" className="bg-background/50" />
                            <Button type="submit">Subscribe</Button>
                        </form>
                    </div>
                </div>
                 <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Bhumicare. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
