import { API_URL } from "../config";
import { loadSession, saveSession } from "./session";

export class ApiError extends Error {
    constructor(
        readonly status: number,
        message: string
    ) {
        super(message);
    }
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}, retried = false): Promise<T> {
    const session = await loadSession();
    const method = init.method ?? "GET";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (session) headers.Authorization = `Bearer ${session.accessToken}`;

    console.log("[api]", method, path, JSON.stringify({ headers, body: init.body }));

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: init.body === undefined ? undefined : JSON.stringify(init.body)
    });

    if (res.status === 401 && session && !retried) {
        const refreshed = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: session.refreshToken })
        });
        if (refreshed.ok) {
            const tokens = (await refreshed.json()) as { accessToken: string; refreshToken: string };
            await saveSession({ ...session, ...tokens });
            return api<T>(path, init, true);
        }
    }
    if (!res.ok) throw new ApiError(res.status, `${method} ${path} failed with ${res.status}`);
    return (await res.json()) as T;
}
