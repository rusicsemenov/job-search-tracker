'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ApplicationStatus } from '@/lib/types';

export async function createApplication(_prevState: { error?: string } | null, formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const jobTitle = formData.get('job_title') as string;
    const companyId = formData.get('company_id') as string;
    if (!jobTitle?.trim()) return { error: 'Job title is required' };

    const dateSent = formData.get('date_sent') as string;

    const { error } = await supabase.from('applications').insert({
        user_id: user.id,
        company_id: companyId,
        job_title: jobTitle.trim(),
        job_url: (formData.get('job_url') as string) || null,
        date_sent: dateSent || null,
        status: (formData.get('status') as ApplicationStatus) || 'applied',
        notes: (formData.get('notes') as string) || null,
    });

    if (error) return { error: error.message };

    revalidatePath(`/companies/${companyId}`);
    redirect(`/companies/${companyId}`);
}

export async function updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    companyId: string,
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('applications').update({ status }).eq('id', id).eq('user_id', user.id);

    revalidatePath(`/companies/${companyId}`);
}

export async function deleteApplication(id: string, companyId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('applications').delete().eq('id', id).eq('user_id', user.id);

    revalidatePath(`/companies/${companyId}`);
}
