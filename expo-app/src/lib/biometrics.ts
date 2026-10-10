import * as LocalAuthentication from "expo-local-authentication";

/** The app lock shown when Larder opens with a saved session. */
export async function unlockWithBiometrics(): Promise<boolean> {
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return true;
    const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock Larder",
        fallbackLabel: "Use passcode"
    });
    return success;
}
