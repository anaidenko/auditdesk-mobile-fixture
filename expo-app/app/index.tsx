import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";

import { IMAGE_BASE } from "../src/config";
import { api } from "../src/lib/api";
import { track } from "../src/lib/analytics";
import { clearSession, loadSession } from "../src/lib/session";

interface Shop {
    id: string;
    name: string;
    photo: string;
    deliveryFrom: string;
}

export default function Home() {
    const [shops, setShops] = useState<Shop[]>([]);

    useEffect(() => {
        loadSession().then(session => {
            if (!session) return router.replace("/login");
            api<Shop[]>("/shops/nearby").then(setShops);
            track("home_viewed");
        });
    }, []);

    const signOut = async () => {
        await clearSession();
        router.replace("/login");
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={shops}
                keyExtractor={shop => shop.id}
                renderItem={({ item }) => (
                    <Pressable onPress={() => router.push({ pathname: "/checkout", params: { shopId: item.id } })}>
                        <Image source={{ uri: `${IMAGE_BASE}/${item.photo}` }} style={{ height: 120 }} />
                        <Text>{item.name}</Text>
                        <Text>Delivery from {item.deliveryFrom}</Text>
                    </Pressable>
                )}
            />
            <Pressable onPress={() => router.push("/help")}>
                <Text>Help</Text>
            </Pressable>
            <Pressable onPress={signOut}>
                <Text>Sign out</Text>
            </Pressable>
        </View>
    );
}
