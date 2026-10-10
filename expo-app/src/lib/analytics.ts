import * as Location from "expo-location";

import { ANALYTICS_URL, APP_VERSION } from "../config";
import { loadSession } from "./session";

/** Sends a product event to Metricly, with where the customer is, for the delivery-area reports. */
export async function track(event: string, props: Record<string, unknown> = {}): Promise<void> {
    const session = await loadSession();
    const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    await fetch(ANALYTICS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            event,
            userId: session?.user.email ?? "anonymous",
            lat: coords.latitude,
            lng: coords.longitude,
            appVersion: APP_VERSION,
            ...props
        })
    }).catch(() => undefined);
}
