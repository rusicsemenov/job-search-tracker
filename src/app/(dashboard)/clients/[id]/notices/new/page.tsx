'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { createNotice } from '@/app/actions/notices';
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

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function NewNoticePage({ params }: PageProps) {
    const { id: companyId } = use(params);
    const [state, action, pending] = useActionState(createNotice, null);

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="p-8 max-w-xl">
            <Link
                href={`/clients/${companyId}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to client
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Log Outreach</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <input type="hidden" name="company_id" value={companyId} />

                        <div className="space-y-1.5">
                            <Label htmlFor="date_sent">Date sent</Label>
                            <Input
                                id="date_sent"
                                name="date_sent"
                                type="date"
                                defaultValue={today}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="channel">Channel</Label>
                            <Select name="channel" defaultValue="email">
                                <SelectTrigger id="channel">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="telegram">Telegram</SelectItem>
                                    <SelectItem value="instagram">Instagram</SelectItem>
                                    <SelectItem value="phone">Phone</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue="sent">
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sent">Sent</SelectItem>
                                    <SelectItem value="seen">Seen</SelectItem>
                                    <SelectItem value="replied">Replied</SelectItem>
                                    <SelectItem value="interested">Interested</SelectItem>
                                    <SelectItem value="not_interested">Not Interested</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Message summary, response details…"
                                rows={3}
                            />
                        </div>

                        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={pending}>
                                {pending ? 'Saving…' : 'Save notice'}
                            </Button>
                            <Link
                                href={`/clients/${companyId}`}
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
