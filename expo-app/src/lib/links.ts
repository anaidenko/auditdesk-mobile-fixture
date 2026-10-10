import * as Linking from "expo-linking";
import { router } from "expo-router";

import { API_URL } from "../config";
import { type Session, saveSession } from "./session";

/**
 * Links from emails and texts:
 *   larder://signin?token=…   one-tap sign-in from the welcome email
 *   larder://order/<id>       an order's tracking page
 *   larder://help?url=…       a help article
 */
export async function openLink(url: string): Promise<void> {
    const { hostname, path, queryParams } = Linking.parse(url);

    if (hostname === "signin" && typeof queryParams?.token === "string") {
        const res = await fetch(`${API_URL}/auth/link`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: queryParams.token })
        });
        if (res.ok) await saveSession((await res.json()) as Session);
        router.replace("/");
        return;
    }

    if (hostname === "order" && path) {
        router.push({ pathname: "/order/[id]", params: { id: path } });
        return;
    }

    if (hostname === "help" && typeof queryParams?.url === "string") {
        router.push({ pathname: "/help", params: { url: queryParams.url } });
    }
}
