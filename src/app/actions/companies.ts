'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { CompanyType } from '@/lib/types';

export async function createCompany(_prevState: { error?: string } | null, formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const name = formData.get('name') as string;
    if (!name?.trim()) return { error: 'Company name is required' };

    const type = (formData.get('type') as CompanyType) || 'job';
    const basePath = type === 'client' ? '/clients' : '/companies';

    const { error } = await supabase.from('companies').insert({
        user_id: user.id,
        name: name.trim(),
        type,
        website: (formData.get('website') as string) || null,
        telegram: (formData.get('telegram') as string) || null,
        phone: (formData.get('phone') as string) || null,
        company_email: (formData.get('company_email') as string) || null,
        instagram: (formData.get('instagram') as string) || null,
        location: (formData.get('location') as string) || null,
        notes: (formData.get('notes') as string) || null,
        status:
            (formData.get('status') as string) ||
            (type === 'client' ? 'prospecting' : 'researching'),
    });

    if (error) return { error: error.message };

    revalidatePath(basePath);
    redirect(basePath);
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

    const type = (formData.get('type') as CompanyType) || 'job';
    const basePath = type === 'client' ? '/clients' : '/companies';

    const { error } = await supabase
        .from('companies')
        .update({
            name: name.trim(),
            website: (formData.get('website') as string) || null,
            telegram: (formData.get('telegram') as string) || null,
            phone: (formData.get('phone') as string) || null,
            company_email: (formData.get('company_email') as string) || null,
            instagram: (formData.get('instagram') as string) || null,
            location: (formData.get('location') as string) || null,
            notes: (formData.get('notes') as string) || null,
            status: formData.get('status') as string,
        })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) return { error: error.message };

    revalidatePath(`${basePath}/${id}`);
    redirect(`${basePath}/${id}`);
}

export async function deleteCompany(id: string, type: CompanyType = 'job') {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('companies').delete().eq('id', id).eq('user_id', user.id);

    const basePath = type === 'client' ? '/clients' : '/companies';
    revalidatePath(basePath);
    redirect(basePath);
}
