'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { createContact } from '@/app/actions/contacts';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function NewContactPage({ params }: PageProps) {
    const { id: companyId } = use(params);
    const [state, action, pending] = useActionState(createContact, null);

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
                    <CardTitle>Add Contact</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <input type="hidden" name="company_id" value={companyId} />

                        <div className="space-y-1.5">
                            <Label htmlFor="name">Name *</Label>
                            <Input id="name" name="name" placeholder="Jane Smith" required />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="role">Role / Title</Label>
                            <Input id="role" name="role" placeholder="Engineering Manager" />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="jane@company.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="linkedin">LinkedIn URL</Label>
                            <Input
                                id="linkedin"
                                name="linkedin"
                                placeholder="https://linkedin.com/in/jane"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="How you met, topics discussed…"
                                rows={3}
                            />
                        </div>

                        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={pending}>
                                {pending ? 'Saving…' : 'Save contact'}
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
