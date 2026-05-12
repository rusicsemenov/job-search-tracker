'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SignOutButton } from '@/components/sign-out-button';

interface SidebarProps {
    userEmail: string;
}

const navItems = [{ href: '/companies', label: 'Companies', icon: Building2 }];

export function Sidebar({ userEmail }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="flex flex-col w-64 h-screen border-r bg-white fixed left-0 top-0">
            <div className="px-6 py-5 border-b">
                <h1 className="text-lg font-semibold tracking-tight">Job Tracker</h1>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                            pathname.startsWith(href)
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </Link>
                ))}
            </nav>

            <div className="px-3 py-4 border-t">
                <p className="px-3 py-1 text-xs text-muted-foreground truncate mb-1">{userEmail}</p>
                <Link
                    href="/profile"
                    className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1',
                        pathname.startsWith('/profile')
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    )}
                >
                    <User className="h-4 w-4" />
                    Profile
                </Link>
                <SignOutButton />
            </div>
        </aside>
    );
}
