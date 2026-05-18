import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, FileText, Briefcase } from 'lucide-react';
import { ApplicationsChart } from '@/components/applications-chart';
import { ApplicationsByDayChart } from '@/components/applications-by-day-chart';
import { type ApplicationStatus } from '@/lib/types';

const APPLICATION_STATUSES: ApplicationStatus[] = [
    'interested',
    'applied',
    'phone_screen',
    'interview',
    'offer',
    'accepted',
    'rejected',
];

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const [
        { count: companiesCount },
        { count: clientsCount },
        { count: contactsCount },
        { data: applications },
    ] = await Promise.all([
        supabase
            .from('companies')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user!.id)
            .eq('type', 'job'),
        supabase
            .from('companies')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user!.id)
            .eq('type', 'client'),
        supabase
            .from('contacts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user!.id),
        supabase.from('applications').select('status, created_at').eq('user_id', user!.id),
    ]);

    const statusCounts = (applications ?? []).reduce<Record<string, number>>((acc, app) => {
        acc[app.status] = (acc[app.status] ?? 0) + 1;
        return acc;
    }, {});

    const chartData = APPLICATION_STATUSES.map((status) => ({
        status,
        count: statusCounts[status] ?? 0,
    }));

    const totalApplications = applications?.length ?? 0;
    const applicationDates = (applications ?? []).map((a) => a.created_at);

    const stats = [
        { label: 'Job Prospects', value: companiesCount ?? 0, icon: Building2 },
        { label: 'Clients', value: clientsCount ?? 0, icon: Briefcase },
        { label: 'Contacts', value: contactsCount ?? 0, icon: Users },
        { label: 'Applications', value: totalApplications, icon: FileText },
    ];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold">Dashboard</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Overview of your job search activity
                </p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                {stats.map(({ label, value, icon: Icon }) => (
                    <Card key={label}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {label}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Applications by Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <ApplicationsChart data={chartData} />
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Applications by Day</CardTitle>
                </CardHeader>
                <CardContent>
                    <ApplicationsByDayChart dates={applicationDates} />
                </CardContent>
            </Card>
        </div>
    );
}
