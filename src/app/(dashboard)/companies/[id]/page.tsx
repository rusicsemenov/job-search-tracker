import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import {
    COMPANY_STATUS_LABELS,
    COMPANY_STATUS_COLOR,
    APPLICATION_STATUS_LABELS,
    APPLICATION_STATUS_COLOR,
    type CompanyStatus,
    type ApplicationStatus,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowLeft, Plus, Globe, MapPin, Mail, ExternalLink } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const [{ data: company }, { data: contacts }, { data: applications }] = await Promise.all([
        supabase.from('companies').select('*').eq('id', id).eq('user_id', user!.id).single(),
        supabase
            .from('contacts')
            .select('*')
            .eq('company_id', id)
            .eq('user_id', user!.id)
            .order('created_at'),
        supabase
            .from('applications')
            .select('*')
            .eq('company_id', id)
            .eq('user_id', user!.id)
            .order('created_at', { ascending: false }),
    ]);

    if (!company) notFound();

    return (
        <div className="p-8 max-w-3xl">
            <Link
                href="/companies"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to companies
            </Link>

            {/* Company header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold">{company.name}</h2>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <Badge className={COMPANY_STATUS_COLOR[company.status as CompanyStatus]}>
                            {COMPANY_STATUS_LABELS[company.status as CompanyStatus]}
                        </Badge>
                        {company.location && (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                {company.location}
                            </span>
                        )}
                        {company.website && (
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <Globe className="h-3.5 w-3.5" />
                                {company.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                    </div>
                </div>
                <Link
                    href={`/companies/${id}/edit`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                >
                    Edit
                </Link>
            </div>

            {company.notes && (
                <Card className="mb-6">
                    <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {company.notes}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Applications */}
            <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-base">Applications</CardTitle>
                    <Link
                        href={`/companies/${id}/applications/new`}
                        className={cn(buttonVariants({ size: 'sm' }))}
                    >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Log application
                    </Link>
                </CardHeader>
                <CardContent>
                    {applications?.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-2">No applications yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 font-medium text-muted-foreground">
                                        Job title
                                    </th>
                                    <th className="text-left py-2 font-medium text-muted-foreground">
                                        Date applied
                                    </th>
                                    <th className="text-left py-2 font-medium text-muted-foreground">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {applications?.map((app) => (
                                    <tr key={app.id}>
                                        <td className="py-2.5 font-medium">
                                            {app.job_url ? (
                                                <a
                                                    href={app.job_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline"
                                                >
                                                    {app.job_title}
                                                </a>
                                            ) : (
                                                app.job_title
                                            )}
                                            {app.notes && (
                                                <p className="text-xs text-muted-foreground font-normal mt-0.5 line-clamp-1">
                                                    {app.notes}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-2.5 text-muted-foreground">
                                            {app.date_sent
                                                ? new Date(app.date_sent).toLocaleDateString()
                                                : '—'}
                                        </td>
                                        <td className="py-2.5">
                                            <Badge
                                                className={
                                                    APPLICATION_STATUS_COLOR[
                                                        app.status as ApplicationStatus
                                                    ]
                                                }
                                            >
                                                {
                                                    APPLICATION_STATUS_LABELS[
                                                        app.status as ApplicationStatus
                                                    ]
                                                }
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-base">Contacts</CardTitle>
                    <Link
                        href={`/companies/${id}/contacts/new`}
                        className={cn(buttonVariants({ size: 'sm' }))}
                    >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Add contact
                    </Link>
                </CardHeader>
                <CardContent>
                    {contacts?.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-2">No contacts yet.</p>
                    ) : (
                        <div className="divide-y">
                            {contacts?.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="py-3 flex items-start justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-sm">{contact.name}</p>
                                        {contact.role && (
                                            <p className="text-xs text-muted-foreground">
                                                {contact.role}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-1">
                                            {contact.email && (
                                                <a
                                                    href={`mailto:${contact.email}`}
                                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    <Mail className="h-3 w-3" />
                                                    {contact.email}
                                                </a>
                                            )}
                                            {contact.linkedin && (
                                                <a
                                                    href={contact.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    LinkedIn
                                                </a>
                                            )}
                                        </div>
                                        {contact.notes && (
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {contact.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
