import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { api } from "../../src/lib/api";

interface Order {
    id: string;
    status: "placed" | "packing" | "on_the_way" | "delivered";
    eta: string | null;
}

export default function OrderPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        api<Order>(`/orders/${encodeURIComponent(id)}`).then(setOrder);
    }, [id]);

    if (!order) return <Text>Loading…</Text>;
    return (
        <View style={{ padding: 24 }}>
            <Text>Order {order.id}</Text>
            <Text>{order.status.replace(/_/g, " ")}</Text>
            {order.eta && <Text>Arriving around {order.eta}</Text>}
        </View>
    );
}
