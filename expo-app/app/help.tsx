import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { WebView } from "react-native-webview";

import { loadSession } from "../src/lib/session";

const HELP_HOME = "https://help.larder.example";

/** The help centre, signed in so that its pages can show the customer's own orders. */
export default function Help() {
    const { url } = useLocalSearchParams<{ url?: string }>();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        loadSession().then(session => setToken(session?.accessToken ?? null));
    }, []);

    return (
        <WebView
            source={{ uri: url ?? HELP_HOME }}
            originWhitelist={["*"]}
            injectedJavaScriptBeforeContentLoaded={`window.larderToken = ${JSON.stringify(token)}; true;`}
            onMessage={event => {
                const message = JSON.parse(event.nativeEvent.data) as { type: string; route?: string };
                if (message.type === "open" && message.route) router.push(message.route as never);
            }}
        />
    );
}
