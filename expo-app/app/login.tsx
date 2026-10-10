import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { api } from "../src/lib/api";
import { track } from "../src/lib/analytics";
import { type Session, saveSession } from "../src/lib/session";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const signIn = async () => {
        try {
            const session = await api<Session>("/auth/login", { method: "POST", body: { email, password } });
            await saveSession(session);
            track("signed_in");
            router.replace("/");
        } catch {
            setError("Wrong email or password.");
        }
    };

    return (
        <View style={{ padding: 24, gap: 12 }}>
            <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            {error && <Text>{error}</Text>}
            <Pressable onPress={signIn}>
                <Text>Sign in</Text>
            </Pressable>
        </View>
    );
}
