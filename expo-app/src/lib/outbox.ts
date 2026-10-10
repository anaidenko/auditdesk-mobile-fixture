import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "./api";

/** Requests made while offline, sent in order when the app is back online. */
export interface Pending {
    path: string;
    method: "POST" | "PUT" | "DELETE";
    body?: unknown;
    queuedAt: string;
}

const KEY = "larder.outbox";

async function read(): Promise<Pending[]> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Pending[]) : [];
}

export async function enqueue(request: Omit<Pending, "queuedAt">): Promise<void> {
    const pending = await read();
    pending.push({ ...request, queuedAt: new Date().toISOString() });
    await AsyncStorage.setItem(KEY, JSON.stringify(pending));
}

export async function flush(): Promise<number> {
    const pending = await read();
    const left: Pending[] = [];
    for (const request of pending) {
        try {
            await api(request.path, { method: request.method, body: request.body });
        } catch {
            left.push(request);
        }
    }
    await AsyncStorage.setItem(KEY, JSON.stringify(left));
    return pending.length - left.length;
}
