import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ApiError, api } from "../src/lib/api";
import { track } from "../src/lib/analytics";
import { enqueue } from "../src/lib/outbox";
import { chargeCard } from "../src/lib/payments";

interface Basket {
    id: string;
    items: { name: string; quantity: number; priceCents: number }[];
    totalCents: number;
}

interface Card {
    token: string;
    last4: string;
}

export default function Checkout() {
    const { shopId } = useLocalSearchParams<{ shopId: string }>();
    const [basket, setBasket] = useState<Basket | null>(null);
    const [card, setCard] = useState<Card | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        api<Basket>(`/shops/${shopId}/basket`).then(setBasket);
        api<Card[]>("/me/cards").then(cards => setCard(cards[0] ?? null));
    }, [shopId]);

    const placeOrder = async () => {
        if (!basket || !card) return;
        const order = { basketId: basket.id, shopId, placedAt: new Date().toISOString() };
        try {
            const placed = await api<{ id: string }>("/orders", { method: "POST", body: order });
            const charge = await chargeCard(card.token, basket.totalCents, placed.id);
            await api(`/orders/${placed.id}/payment`, { method: "PUT", body: { chargeId: charge.id } });
            track("order_placed", { orderId: placed.id, totalCents: basket.totalCents });
            router.replace({ pathname: "/order/[id]", params: { id: placed.id } });
        } catch (e) {
            if (e instanceof ApiError) return setMessage(e.message);
            await enqueue({ path: "/orders", method: "POST", body: order });
            setMessage("You are offline: the order will be sent when you are back online.");
        }
    };

    if (!basket) return <Text>Loading…</Text>;
    return (
        <View style={{ padding: 24, gap: 8 }}>
            {basket.items.map(item => (
                <Text key={item.name}>
                    {item.quantity} × {item.name}
                </Text>
            ))}
            <Text>Total ${(basket.totalCents / 100).toFixed(2)}</Text>
            {card && <Text>Card ending {card.last4}</Text>}
            {message && <Text>{message}</Text>}
            <Pressable onPress={placeOrder}>
                <Text>Place order</Text>
            </Pressable>
        </View>
    );
}
