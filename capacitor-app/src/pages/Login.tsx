import { IonButton, IonContent, IonInput, IonPage, IonText } from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import { signIn } from "../services/auth";

export default function Login() {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const submit = async () => {
        try {
            await signIn(email, password);
            history.replace("/jobs");
        } catch (e) {
            setError((e as Error).message);
        }
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonInput label="Email" type="email" value={email} onIonInput={e => setEmail(String(e.detail.value ?? ""))} />
                <IonInput label="Password" type="password" value={password} onIonInput={e => setPassword(String(e.detail.value ?? ""))} />
                {error && <IonText color="danger">{error}</IonText>}
                <IonButton expand="block" onClick={submit}>
                    Sign in
                </IonButton>
            </IonContent>
        </IonPage>
    );
}
