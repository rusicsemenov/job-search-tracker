'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

interface Props {
    dates: string[];
}

export function ApplicationsByDayChart({ dates }: Props) {
    const availableMonths = useMemo(() => {
        const seen = new Set<string>();
        for (const d of dates) {
            seen.add(d.slice(0, 7));
        }
        return Array.from(seen).sort().reverse();
    }, [dates]);

    const currentMonthKey = new Date().toISOString().slice(0, 7);
    const defaultMonth = availableMonths.includes(currentMonthKey)
        ? currentMonthKey
        : (availableMonths[0] ?? currentMonthKey);

    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

    const chartData = useMemo(() => {
        const [year, month] = selectedMonth.split('-').map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();
        const counts: Record<number, number> = {};

        for (const d of dates) {
            if (d.startsWith(selectedMonth)) {
                const day = parseInt(d.slice(8, 10), 10);
                counts[day] = (counts[day] ?? 0) + 1;
            }
        }

        return Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            count: counts[i + 1] ?? 0,
        }));
    }, [dates, selectedMonth]);

    if (availableMonths.length === 0) {
        return (
            <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">
                No applications yet
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Select value={selectedMonth} onValueChange={(v) => v && setSelectedMonth(v)}>
                    <SelectTrigger size="sm" className="w-44">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {availableMonths.map((key) => {
                            const [y, m] = key.split('-').map(Number);
                            return (
                                <SelectItem key={key} value={key}>
                                    {MONTH_NAMES[m - 1]} {y}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 4, right: 16, left: -8, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="day"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                    />
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
                        formatter={(value) => [value, 'Applications']}
                        labelFormatter={(label) => `Day ${label}`}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
