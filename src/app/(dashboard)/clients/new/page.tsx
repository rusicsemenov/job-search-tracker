'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { createCompany } from '@/app/actions/companies';
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

export default function NewClientPage() {
    const [state, action, pending] = useActionState(createCompany, null);

    return (
        <div className="p-8 max-w-xl">
            <Link
                href="/clients"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to clients
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Add Client</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <input type="hidden" name="type" value="client" />

                        <div className="space-y-1.5">
                            <Label htmlFor="name">Client name *</Label>
                            <Input id="name" name="name" placeholder="Acme Corp" required />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                name="website"
                                placeholder="https://acme.com"
                                type="url"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="telegram">Telegram</Label>
                            <Input id="telegram" name="telegram" placeholder="@acmecorp" />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" placeholder="+1 555 000 0000" />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="company_email">Email</Label>
                            <Input
                                id="company_email"
                                name="company_email"
                                type="email"
                                placeholder="hello@acme.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                                id="instagram"
                                name="instagram"
                                placeholder="https://instagram.com/acmecorp"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" name="location" placeholder="San Francisco, CA" />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue="prospecting">
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
                                placeholder="Any details about this client…"
                                rows={3}
                            />
                        </div>

                        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={pending}>
                                {pending ? 'Saving…' : 'Save client'}
                            </Button>
                            <Link
                                href="/clients"
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
