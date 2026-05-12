'use client';

import { useActionState, useState } from 'react';
import { login, register } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loginState, loginAction, loginPending] = useActionState(login, null);
    const [registerState, registerAction, registerPending] = useActionState(register, null);

    const isLogin = mode === 'login';
    const state = isLogin ? loginState : registerState;
    const action = isLogin ? loginAction : registerAction;
    const pending = isLogin ? loginPending : registerPending;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">Job Tracker</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Your personal job search CRM
                    </p>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex rounded-md border p-1 gap-1">
                            <button
                                type="button"
                                onClick={() => setMode('login')}
                                className={`flex-1 rounded text-sm font-medium py-1.5 transition-colors ${
                                    isLogin
                                        ? 'bg-white shadow-sm text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Sign in
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('register')}
                                className={`flex-1 rounded text-sm font-medium py-1.5 transition-colors ${
                                    !isLogin
                                        ? 'bg-white shadow-sm text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Register
                            </button>
                        </div>
                        <CardTitle className="text-base mt-3">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </CardTitle>
                        <CardDescription>
                            {isLogin
                                ? 'Sign in to your job tracker'
                                : 'Start tracking your job search'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={action} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                />
                            </div>
                            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
                            <Button type="submit" className="w-full" disabled={pending}>
                                {pending ? 'Loading…' : isLogin ? 'Sign in' : 'Create account'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
