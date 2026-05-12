'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(_prevState: { error?: string } | null, formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    redirect('/companies');
}

export async function register(_prevState: { error?: string } | null, formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    redirect('/companies');
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}

export async function changePassword(
    _prevState: { error?: string; success?: boolean } | null,
    formData: FormData,
) {
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
        return { error: 'New passwords do not match' };
    }
    if (newPassword.length < 6) {
        return { error: 'New password must be at least 6 characters' };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return { error: 'Not authenticated' };

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
    });
    if (signInError) return { error: 'Current password is incorrect' };

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };

    return { success: true };
}
