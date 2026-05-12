import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import { Plus, Search, Building2 } from 'lucide-react';
import { COMPANY_STATUS_LABELS, COMPANY_STATUS_COLOR, type CompanyStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function CompaniesPage({ searchParams }: PageProps) {
    const { q } = await searchParams;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
        .from('companies')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

    if (q?.trim()) {
        query = query.ilike('name', `%${q.trim()}%`);
    }

    const { data: companies } = await query;

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold">Companies</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {companies?.length ?? 0} {companies?.length === 1 ? 'company' : 'companies'}
                    </p>
                </div>
                <Link href="/companies/new" className={cn(buttonVariants())}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                </Link>
            </div>

            <form className="mb-6">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        name="q"
                        defaultValue={q}
                        placeholder="Search companies…"
                        className="pl-9"
                    />
                </div>
            </form>

            {companies?.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">
                        {q ? 'No companies match your search' : 'No companies yet'}
                    </p>
                    {!q && (
                        <p className="text-sm mt-1">
                            <Link
                                href="/companies/new"
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                Add your first company
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
                                    Company
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
                            {companies?.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium">
                                        <Link
                                            href={`/companies/${company.id}`}
                                            className="hover:underline"
                                        >
                                            {company.name}
                                        </Link>
                                        {company.website && (
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                {company.website}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {company.location ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            className={
                                                COMPANY_STATUS_COLOR[
                                                    company.status as CompanyStatus
                                                ]
                                            }
                                        >
                                            {COMPANY_STATUS_LABELS[company.status as CompanyStatus]}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={`/companies/${company.id}`}
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
