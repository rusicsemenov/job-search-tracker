'use client';

import { useActionState, useEffect, useRef } from 'react';
import { changePassword } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
    const [state, action, pending] = useActionState(changePassword, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) formRef.current?.reset();
    }, [state]);

    return (
        <div className="p-8 max-w-lg">
            <h1 className="text-2xl font-semibold mb-6">Profile</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Change Password</CardTitle>
                    <CardDescription>Enter your current password to set a new one.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form ref={formRef} action={action} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="currentPassword">Current password</Label>
                            <PasswordInput
                                id="currentPassword"
                                name="currentPassword"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="newPassword">New password</Label>
                            <PasswordInput
                                id="newPassword"
                                name="newPassword"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword">Confirm new password</Label>
                            <PasswordInput
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                autoComplete="new-password"
                            />
                        </div>

                        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
                        {state?.success && (
                            <p className="text-sm text-green-600">Password updated successfully.</p>
                        )}

                        <Button type="submit" disabled={pending}>
                            {pending ? 'Updating…' : 'Update password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
