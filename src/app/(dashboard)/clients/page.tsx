import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import { Plus, Search, Users } from 'lucide-react';
import { CLIENT_STATUS_LABELS, CLIENT_STATUS_COLOR, type ClientStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function ClientsPage({ searchParams }: PageProps) {
    const { q } = await searchParams;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
        .from('companies')
        .select('*')
        .eq('user_id', user!.id)
        .eq('type', 'client')
        .order('created_at', { ascending: false });

    if (q?.trim()) {
        query = query.ilike('name', `%${q.trim()}%`);
    }

    const { data: clients } = await query;

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold">Clients</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {clients?.length ?? 0} {clients?.length === 1 ? 'client' : 'clients'}
                    </p>
                </div>
                <Link href="/clients/new" className={cn(buttonVariants())}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                </Link>
            </div>

            <form className="mb-6">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        name="q"
                        defaultValue={q}
                        placeholder="Search clients…"
                        className="pl-9"
                    />
                </div>
            </form>

            {clients?.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">
                        {q ? 'No clients match your search' : 'No clients yet'}
                    </p>
                    {!q && (
                        <p className="text-sm mt-1">
                            <Link
                                href="/clients/new"
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                Add your first client
                            </Link>
                        </p>
                    )}
                </div>
            ) : (
                <div className="rounded-lg border bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                                    Client
                                </th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                                    Location
                                </th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {clients?.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium">
                                        <Link
                                            href={`/clients/${client.id}`}
                                            className="hover:underline"
                                        >
                                            {client.name}
                                        </Link>
                                        {client.website && (
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                {client.website}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {client.location ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            className={
                                                CLIENT_STATUS_COLOR[client.status as ClientStatus]
                                            }
                                        >
                                            {CLIENT_STATUS_LABELS[client.status as ClientStatus]}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={`/clients/${client.id}`}
                                            className={cn(
                                                buttonVariants({ variant: 'ghost', size: 'sm' }),
                                            )}
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
