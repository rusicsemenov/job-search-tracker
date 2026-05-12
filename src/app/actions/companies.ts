'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { CompanyStatus } from '@/lib/types';

export async function createCompany(_prevState: { error?: string } | null, formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const name = formData.get('name') as string;
    if (!name?.trim()) return { error: 'Company name is required' };

    const { error } = await supabase.from('companies').insert({
        user_id: user.id,
        name: name.trim(),
        website: (formData.get('website') as string) || null,
        location: (formData.get('location') as string) || null,
        notes: (formData.get('notes') as string) || null,
        status: (formData.get('status') as CompanyStatus) || 'researching',
    });

    if (error) return { error: error.message };

    revalidatePath('/companies');
    redirect('/companies');
}

export async function updateCompany(_prevState: { error?: string } | null, formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    if (!name?.trim()) return { error: 'Company name is required' };

    const { error } = await supabase
        .from('companies')
        .update({
            name: name.trim(),
            website: (formData.get('website') as string) || null,
            location: (formData.get('location') as string) || null,
            notes: (formData.get('notes') as string) || null,
            status: formData.get('status') as CompanyStatus,
        })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) return { error: error.message };

    revalidatePath(`/companies/${id}`);
    redirect(`/companies/${id}`);
}

export async function deleteCompany(id: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('companies').delete().eq('id', id).eq('user_id', user.id);

    revalidatePath('/companies');
    redirect('/companies');
}
