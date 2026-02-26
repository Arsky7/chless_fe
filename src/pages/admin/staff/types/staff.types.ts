export interface Staff {
    id: number;
    user_id: number;
    staff_number: string;
    full_name: string;
    email: string;
    phone: string | null;
    status: 'active' | 'onleave' | 'inactive';
    join_date: string;
    schedule: string | null;
    shift_days: string | null;
    address: string | null;
    emergency_contact: string | null;
    created_at: string;
    updated_at: string;
}

export interface StaffStats {
    total_staff: number;
    active_staff: number;
    new_this_month: number;
    active_rate: number;
}

export interface StaffFilters {
    status: string;
    search: string;
    page?: number;
    per_page?: number;
}

export interface StaffResponse {
    data: Staff[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}
