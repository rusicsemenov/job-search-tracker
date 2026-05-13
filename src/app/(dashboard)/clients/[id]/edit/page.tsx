'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { updateCompany } from '@/app/actions/companies';
import { createClient } from '@/lib/supabase/client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Company } from '@/lib/types';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditClientPage({ params }: PageProps) {
    const { id } = use(params);
    const [state, action, pending] = useActionState(updateCompany, null);
    const [client, setClient] = useState<Company | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase
            .from('companies')
            .select('*')
            .eq('id', id)
            .single()
            .then(({ data }) => {
                setClient(data);
            });
    }, [id]);

    if (!client) {
        return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
    }

    return (
        <div className="p-8 max-w-xl">
            <Link
                href={`/clients/${id}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to client
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Client</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <input type="hidden" name="id" value={id} />
                        <input type="hidden" name="type" value="client" />

                        <div className="space-y-1.5">
                            <Label htmlFor="name">Client name *</Label>
                            <Input id="name" name="name" defaultValue={client.name} required />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                name="website"
                                defaultValue={client.website ?? ''}
                                type="url"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="telegram">Telegram</Label>
                            <Input
                                id="telegram"
                                name="telegram"
                                defaultValue={client.telegram ?? ''}
                                placeholder="@acmecorp"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                defaultValue={client.phone ?? ''}
                                placeholder="+1 555 000 0000"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="company_email">Email</Label>
                            <Input
                                id="company_email"
                                name="company_email"
                                type="email"
                                defaultValue={client.company_email ?? ''}
                                placeholder="hello@acme.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                                id="instagram"
                                name="instagram"
                                defaultValue={client.instagram ?? ''}
                                placeholder="https://instagram.com/acmecorp"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                defaultValue={client.location ?? ''}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue={client.status}>
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="prospecting">Prospecting</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="interested">Interested</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                defaultValue={client.notes ?? ''}
                                rows={3}
                            />
                        </div>

                        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={pending}>
                                {pending ? 'Saving…' : 'Save changes'}
                            </Button>
                            <Link
                                href={`/clients/${id}`}
                                className={cn(buttonVariants({ variant: 'outline' }))}
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
