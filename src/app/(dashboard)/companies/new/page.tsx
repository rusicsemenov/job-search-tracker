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

export default function NewCompanyPage() {
    const [state, action, pending] = useActionState(createCompany, null);

    return (
        <div className="p-8 max-w-xl">
            <Link
                href="/companies"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to companies
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Add Company</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Company name *</Label>
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
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" name="location" placeholder="San Francisco, CA" />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue="researching">
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="researching">Researching</SelectItem>
                                    <SelectItem value="actively_applying">
                                        Actively Applying
                                    </SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Any details about this company…"
                                rows={3}
                            />
                        </div>

                        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={pending}>
                                {pending ? 'Saving…' : 'Save company'}
                            </Button>
                            <Link
                                href="/companies"
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
