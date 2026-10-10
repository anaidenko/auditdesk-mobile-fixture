import { Preferences } from "@capacitor/preferences";

const TOKEN = "fieldbook.token";

export async function signIn(email: string, password: string): Promise<void> {
    const res = await fetch(`${import.meta.env.VITE_API_URL ?? "https://api.fieldbook.example"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Wrong email or password.");
    const { token } = (await res.json()) as { token: string };
    await Preferences.set({ key: TOKEN, value: token });
}

export async function getToken(): Promise<string | null> {
    return (await Preferences.get({ key: TOKEN })).value;
}

export async function signOut(): Promise<void> {
    await Preferences.remove({ key: TOKEN });
}
