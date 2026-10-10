import { Preferences } from "@capacitor/preferences";

const PIN = "fieldbook.pin";

/** The four-digit PIN that unlocks the app between jobs, so technicians need not sign in again. */
export async function setPin(pin: string): Promise<void> {
    await Preferences.set({ key: PIN, value: pin });
}

export async function checkPin(entered: string): Promise<boolean> {
    const { value } = await Preferences.get({ key: PIN });
    return value !== null && value === entered;
}
