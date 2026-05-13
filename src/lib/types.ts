export type CompanyType = 'job' | 'client';
export type CompanyStatus = 'researching' | 'actively_applying' | 'archived';
export type ClientStatus = 'prospecting' | 'contacted' | 'interested' | 'closed' | 'archived';
export type ApplicationStatus =
    | 'interested'
    | 'applied'
    | 'phone_screen'
    | 'interview'
    | 'offer'
    | 'accepted'
    | 'rejected';
export type NoticeChannel = 'email' | 'telegram' | 'instagram' | 'phone' | 'other';
export type NoticeStatus = 'sent' | 'seen' | 'replied' | 'interested' | 'not_interested';

export interface Company {
    id: string;
    user_id: string;
    name: string;
    type: CompanyType;
    website: string | null;
    telegram: string | null;
    phone: string | null;
    company_email: string | null;
    instagram: string | null;
    location: string | null;
    notes: string | null;
    status: string;
    created_at: string;
}

export interface Contact {
    id: string;
    user_id: string;
    company_id: string;
    name: string;
    role: string | null;
    email: string | null;
    linkedin: string | null;
    telegram: string | null;
    instagram: string | null;
    notes: string | null;
    created_at: string;
}

export interface Application {
    id: string;
    user_id: string;
    company_id: string;
    job_title: string;
    job_url: string | null;
    date_sent: string | null;
    status: ApplicationStatus;
    notes: string | null;
    created_at: string;
}

export interface Notice {
    id: string;
    user_id: string;
    company_id: string;
    date_sent: string | null;
    channel: NoticeChannel;
    status: NoticeStatus;
    notes: string | null;
    created_at: string;
}

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
    researching: 'Researching',
    actively_applying: 'Actively Applying',
    archived: 'Archived',
};

export const COMPANY_STATUS_COLOR: Record<CompanyStatus, string> = {
    researching: 'bg-amber-100 text-amber-800 border-amber-200',
    actively_applying: 'bg-green-100 text-green-800 border-green-200',
    archived: 'bg-gray-100 text-gray-500 border-gray-200',
};

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
    prospecting: 'Prospecting',
    contacted: 'Contacted',
    interested: 'Interested',
    closed: 'Closed',
    archived: 'Archived',
};

export const CLIENT_STATUS_COLOR: Record<ClientStatus, string> = {
    prospecting: 'bg-blue-100 text-blue-700 border-blue-200',
    contacted: 'bg-amber-100 text-amber-800 border-amber-200',
    interested: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    archived: 'bg-gray-100 text-gray-500 border-gray-200',
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
    interested: 'Interested',
    applied: 'Applied',
    phone_screen: 'Phone Screen',
    interview: 'Interview',
    offer: 'Offer',
    accepted: 'Accepted',
    rejected: 'Rejected',
};

export const APPLICATION_STATUS_COLOR: Record<ApplicationStatus, string> = {
    interested: 'bg-blue-100 text-blue-700 border-blue-200',
    applied: 'bg-sky-100 text-sky-700 border-sky-200',
    phone_screen: 'bg-amber-100 text-amber-800 border-amber-200',
    interview: 'bg-orange-100 text-orange-800 border-orange-200',
    offer: 'bg-green-100 text-green-800 border-green-200',
    accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
};

export const NOTICE_CHANNEL_LABELS: Record<NoticeChannel, string> = {
    email: 'Email',
    telegram: 'Telegram',
    instagram: 'Instagram',
    phone: 'Phone',
    other: 'Other',
};

export const NOTICE_STATUS_LABELS: Record<NoticeStatus, string> = {
    sent: 'Sent',
    seen: 'Seen',
    replied: 'Replied',
    interested: 'Interested',
    not_interested: 'Not Interested',
};

export const NOTICE_STATUS_COLOR: Record<NoticeStatus, string> = {
    sent: 'bg-gray-100 text-gray-600 border-gray-200',
    seen: 'bg-blue-100 text-blue-700 border-blue-200',
    replied: 'bg-amber-100 text-amber-800 border-amber-200',
    interested: 'bg-green-100 text-green-800 border-green-200',
    not_interested: 'bg-red-100 text-red-700 border-red-200',
};
