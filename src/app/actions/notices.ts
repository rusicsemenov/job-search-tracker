'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { NoticeChannel, NoticeStatus } from '@/lib/types';

export async function createNotice(_prevState: { error?: string } | null, formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const companyId = formData.get('company_id') as string;
    const dateSent = formData.get('date_sent') as string;

    const { error } = await supabase.from('notices').insert({
        user_id: user.id,
        company_id: companyId,
        date_sent: dateSent || null,
        channel: (formData.get('channel') as NoticeChannel) || 'email',
        status: (formData.get('status') as NoticeStatus) || 'sent',
        notes: (formData.get('notes') as string) || null,
    });

    if (error) return { error: error.message };

    revalidatePath(`/clients/${companyId}`);
    redirect(`/clients/${companyId}`);
}

export async function updateNotice(_prevState: { error?: string } | null, formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const id = formData.get('id') as string;
    const companyId = formData.get('company_id') as string;
    const dateSent = formData.get('date_sent') as string;

    const { error } = await supabase
        .from('notices')
        .update({
            date_sent: dateSent || null,
            channel: (formData.get('channel') as NoticeChannel) || 'email',
            status: (formData.get('status') as NoticeStatus) || 'sent',
            notes: (formData.get('notes') as string) || null,
        })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) return { error: error.message };

    revalidatePath(`/clients/${companyId}`);
    redirect(`/clients/${companyId}`);
}

export async function deleteNotice(id: string, companyId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('notices').delete().eq('id', id).eq('user_id', user.id);

    revalidatePath(`/clients/${companyId}`);
}
