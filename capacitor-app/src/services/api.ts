import { getToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL ?? "https://api.fieldbook.example";

export interface Job {
    id: string;
    customer: string;
    address: string;
    gateCode: string | null;
    notes: string;
    status: "scheduled" | "in_progress" | "complete" | "cancelled";
    report: string | null;
    updatedAt: string;
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
    const token = await getToken();
    const res = await fetch(`${API_URL}${path}`, {
        method: init.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: init.body === undefined ? undefined : JSON.stringify(init.body)
    });
    if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} failed with ${res.status}`);
    return (await res.json()) as T;
}

export const listJobs = () => api<Job[]>("/me/jobs?day=today");
export const getJob = (id: string) => api<Job>(`/jobs/${encodeURIComponent(id)}`);
export const completeJob = (id: string) => api<Job>(`/jobs/${encodeURIComponent(id)}/complete`, { method: "POST" });
