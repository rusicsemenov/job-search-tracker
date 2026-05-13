'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createContact(_prevState: { error?: string } | null, formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const name = formData.get('name') as string;
    const companyId = formData.get('company_id') as string;
    if (!name?.trim()) return { error: 'Contact name is required' };

    const redirectTo = (formData.get('redirect_to') as string) || `/companies/${companyId}`;

    const { error } = await supabase.from('contacts').insert({
        user_id: user.id,
        company_id: companyId,
        name: name.trim(),
        role: (formData.get('role') as string) || null,
        email: (formData.get('email') as string) || null,
        linkedin: (formData.get('linkedin') as string) || null,
        telegram: (formData.get('telegram') as string) || null,
        instagram: (formData.get('instagram') as string) || null,
        notes: (formData.get('notes') as string) || null,
    });

    if (error) return { error: error.message };

    revalidatePath(redirectTo);
    redirect(redirectTo);
}

export async function deleteContact(id: string, companyId: string, redirectTo?: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('contacts').delete().eq('id', id).eq('user_id', user.id);

    const path = redirectTo || `/companies/${companyId}`;
    revalidatePath(path);
}
