import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import {
    CLIENT_STATUS_LABELS,
    CLIENT_STATUS_COLOR,
    NOTICE_CHANNEL_LABELS,
    NOTICE_STATUS_LABELS,
    NOTICE_STATUS_COLOR,
    type ClientStatus,
    type NoticeChannel,
    type NoticeStatus,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    Plus,
    Globe,
    MapPin,
    Mail,
    ExternalLink,
    Pencil,
    Phone,
    Send,
} from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const [{ data: client }, { data: contacts }, { data: notices }] = await Promise.all([
        supabase.from('companies').select('*').eq('id', id).eq('user_id', user!.id).single(),
        supabase
            .from('contacts')
            .select('*')
            .eq('company_id', id)
            .eq('user_id', user!.id)
            .order('created_at'),
        supabase
            .from('notices')
            .select('*')
            .eq('company_id', id)
            .eq('user_id', user!.id)
            .order('created_at', { ascending: false }),
    ]);

    if (!client) notFound();

    return (
        <div className="p-8 max-w-3xl">
            <Link
                href="/clients"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to clients
            </Link>

            {/* Client header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold">{client.name}</h2>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <Badge className={CLIENT_STATUS_COLOR[client.status as ClientStatus]}>
                            {CLIENT_STATUS_LABELS[client.status as ClientStatus]}
                        </Badge>
                        {client.location && (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                {client.location}
                            </span>
                        )}
                        {client.website && (
                            <a
                                href={client.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <Globe className="h-3.5 w-3.5" />
                                {client.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                        {client.telegram && (
                            <a
                                href={`https://t.me/${client.telegram.replace(/^@/, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <Send className="h-3.5 w-3.5" />
                                {client.telegram}
                            </a>
                        )}
                        {client.phone && (
                            <a
                                href={`tel:${client.phone}`}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <Phone className="h-3.5 w-3.5" />
                                {client.phone}
                            </a>
                        )}
                        {client.company_email && (
                            <a
                                href={`mailto:${client.company_email}`}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <Mail className="h-3.5 w-3.5" />
                                {client.company_email}
                            </a>
                        )}
                        {client.instagram && (
                            <a
                                href={client.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Instagram
                            </a>
                        )}
                    </div>
                </div>
                <Link
                    href={`/clients/${id}/edit`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                >
                    Edit
                </Link>
            </div>

            {client.notes && (
                <Card className="mb-6">
                    <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {client.notes}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Notices */}
            <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-base">Outreach</CardTitle>
                    <Link
                        href={`/clients/${id}/notices/new`}
                        className={cn(buttonVariants({ size: 'sm' }))}
                    >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Log notice
                    </Link>
                </CardHeader>
                <CardContent>
                    {notices?.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-2">No outreach yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 font-medium text-muted-foreground">
                                        Date
                                    </th>
                                    <th className="text-left py-2 font-medium text-muted-foreground">
                                        Channel
                                    </th>
                                    <th className="text-left py-2 font-medium text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="py-2" />
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {notices?.map((notice) => (
                                    <tr key={notice.id}>
                                        <td className="py-2.5 text-muted-foreground">
                                            {notice.date_sent
                                                ? new Date(notice.date_sent).toLocaleDateString()
                                                : '—'}
                                        </td>
                                        <td className="py-2.5 font-medium">
                                            {NOTICE_CHANNEL_LABELS[notice.channel as NoticeChannel]}
                                            {notice.notes && (
                                                <p className="text-xs text-muted-foreground font-normal mt-0.5 line-clamp-1">
                                                    {notice.notes}
                                                </p>
                                            )}
                                        </td>
                                        <td className="p-2.5">
                                            <Badge
                                                className={
                                                    NOTICE_STATUS_COLOR[
                                                        notice.status as NoticeStatus
                                                    ]
                                                }
                                            >
                                                {
                                                    NOTICE_STATUS_LABELS[
                                                        notice.status as NoticeStatus
                                                    ]
                                                }
                                            </Badge>
                                        </td>
                                        <td className="p-2.5 text-right">
                                            <Link
                                                href={`/clients/${id}/notices/${notice.id}/edit`}
                                                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                            >
                                                <Pencil className="h-3 w-3" />
                                                Edit
                                            </Link>
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
                        href={`/clients/${id}/contacts/new`}
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
                                        <div className="flex items-center gap-3 mt-1 flex-wrap">
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
                                            {contact.telegram && (
                                                <a
                                                    href={`https://t.me/${contact.telegram.replace(/^@/, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    <Send className="h-3 w-3" />
                                                    {contact.telegram}
                                                </a>
                                            )}
                                            {contact.instagram && (
                                                <a
                                                    href={contact.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    Instagram
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
