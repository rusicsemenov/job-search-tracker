'use client';

import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
    return (
        <form action={logout}>
            <Button
                variant="ghost"
                size="sm"
                type="submit"
                className="w-full justify-start gap-2 text-muted-foreground"
            >
                <LogOut className="h-4 w-4" />
                Sign out
            </Button>
        </form>
    );
}
