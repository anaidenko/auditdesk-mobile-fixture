import { PAYWISE_KEY, PAYWISE_URL } from "../config";

export interface Charge {
    id: string;
    status: "succeeded" | "pending" | "failed";
}

/** Charges a saved card for an order; the order is marked paid once the charge succeeds. */
export async function chargeCard(cardToken: string, amountCents: number, orderId: string): Promise<Charge> {
    const res = await fetch(`${PAYWISE_URL}/charges`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${PAYWISE_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ source: cardToken, amount: amountCents, currency: "usd", metadata: { orderId } })
    });
    if (!res.ok) throw new Error(`The payment did not go through (${res.status}).`);
    return (await res.json()) as Charge;
}
