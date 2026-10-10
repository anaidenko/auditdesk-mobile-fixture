import { Network } from "@capacitor/network";
import { Preferences } from "@capacitor/preferences";

import { type Job, api } from "./api";

const KEY = "fieldbook.reports";

/** A job as the technician left it while offline, sent as a whole when the signal comes back. */
interface QueuedReport {
    job: Job;
    savedAt: string;
}

async function read(): Promise<QueuedReport[]> {
    const { value } = await Preferences.get({ key: KEY });
    return value ? (JSON.parse(value) as QueuedReport[]) : [];
}

export async function saveReport(job: Job): Promise<void> {
    const queued = (await read()).filter(q => q.job.id !== job.id);
    queued.push({ job, savedAt: new Date().toISOString() });
    await Preferences.set({ key: KEY, value: JSON.stringify(queued) });
}

export async function sendReports(): Promise<void> {
    const left: QueuedReport[] = [];
    for (const q of await read()) {
        try {
            await api(`/jobs/${encodeURIComponent(q.job.id)}`, { method: "PUT", body: q.job });
        } catch {
            left.push(q);
        }
    }
    await Preferences.set({ key: KEY, value: JSON.stringify(left) });
}

Network.addListener("networkStatusChange", status => {
    if (status.connected) sendReports();
});
