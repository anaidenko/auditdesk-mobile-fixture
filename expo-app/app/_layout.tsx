import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

import { openLink } from "../src/lib/links";
import { flush } from "../src/lib/outbox";
import { loadSession } from "../src/lib/session";

export default function RootLayout() {
    useEffect(() => {
        Location.requestForegroundPermissionsAsync();
        loadSession().then(session => {
            if (session) router.replace("/unlock");
        });
        Linking.getInitialURL().then(url => url && openLink(url));
        const links = Linking.addEventListener("url", event => openLink(event.url));
        const state = AppState.addEventListener("change", next => {
            if (next === "active") flush();
        });
        return () => {
            links.remove();
            state.remove();
        };
    }, []);

    return <Stack screenOptions={{ headerShown: false }} />;
}
