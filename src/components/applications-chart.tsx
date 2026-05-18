'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from '@/lib/types';

const STATUS_COLORS: Record<ApplicationStatus, string> = {
    interested: '#1d4ed8',
    applied: '#0369a1',
    phone_screen: '#b45309',
    interview: '#c2410c',
    offer: '#15803d',
    accepted: '#047857',
    rejected: '#b91c1c',
};

interface Props {
    data: { status: ApplicationStatus; count: number }[];
}

export function ApplicationsChart({ data }: Props) {
    const chartData = data.map((d) => ({
        name: APPLICATION_STATUS_LABELS[d.status],
        count: d.count,
        status: d.status,
    }));

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 4, right: 16, left: -8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{
                        fontSize: 12,
                        borderRadius: 6,
                        border: '1px solid #e5e7eb',
                    }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry) => (
                        <Cell
                            key={entry.status}
                            fill={STATUS_COLORS[entry.status as ApplicationStatus]}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
