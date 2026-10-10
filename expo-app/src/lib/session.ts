import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Session {
    accessToken: string;
    refreshToken: string;
    user: User;
}

const KEY = "larder.session";

export async function saveSession(session: Session): Promise<void> {
    await AsyncStorage.setItem(KEY, JSON.stringify(session));
}

export async function loadSession(): Promise<Session | null> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
}

export async function clearSession(): Promise<void> {
    await AsyncStorage.removeItem(KEY);
}
