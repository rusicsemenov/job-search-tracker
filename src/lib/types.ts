export type CompanyStatus = 'researching' | 'actively_applying' | 'archived';
export type ApplicationStatus =
    | 'interested'
    | 'applied'
    | 'phone_screen'
    | 'interview'
    | 'offer'
    | 'accepted'
    | 'rejected';

export interface Company {
    id: string;
    user_id: string;
    name: string;
    website: string | null;
    location: string | null;
    notes: string | null;
    status: CompanyStatus;
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
