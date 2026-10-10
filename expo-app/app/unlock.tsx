import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { unlockWithBiometrics } from "../src/lib/biometrics";

export default function Unlock() {
    const [failed, setFailed] = useState(false);

    const unlock = async () => {
        if (await unlockWithBiometrics()) router.replace("/");
        else setFailed(true);
    };

    useEffect(() => {
        unlock();
    }, []);

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Larder is locked</Text>
            {failed && (
                <Pressable onPress={unlock}>
                    <Text>Try again</Text>
                </Pressable>
            )}
        </View>
    );
}
