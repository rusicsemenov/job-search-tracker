'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { createApplication } from '@/app/actions/applications';
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

export default function NewApplicationPage({ params }: PageProps) {
    const { id: companyId } = use(params);
    const [state, action, pending] = useActionState(createApplication, null);

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="p-8 max-w-xl">
            <Link
                href={`/companies/${companyId}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to company
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Log Application</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <input type="hidden" name="company_id" value={companyId} />

                        <div className="space-y-1.5">
                            <Label htmlFor="job_title">Job title *</Label>
                            <Input
                                id="job_title"
                                name="job_title"
                                placeholder="Senior Software Engineer"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="job_url">Job posting URL</Label>
                            <Input
                                id="job_url"
                                name="job_url"
                                type="url"
                                placeholder="https://jobs.company.com/123"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="date_sent">Date applied</Label>
                            <Input
                                id="date_sent"
                                name="date_sent"
                                type="date"
                                defaultValue={today}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue="applied">
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="interested">Interested</SelectItem>
                                    <SelectItem value="applied">Applied</SelectItem>
                                    <SelectItem value="phone_screen">Phone Screen</SelectItem>
                                    <SelectItem value="interview">Interview</SelectItem>
                                    <SelectItem value="offer">Offer</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Cover letter details, referrals, recruiter name…"
                                rows={3}
                            />
                        </div>

                        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={pending}>
                                {pending ? 'Saving…' : 'Save application'}
                            </Button>
                            <Link
                                href={`/companies/${companyId}`}
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
