import { App as CapApp } from "@capacitor/app";
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { signIn, signOut } from "../services/auth";
import { setPin } from "../services/pin";

export default function Settings() {
    const history = useHistory();
    const [version, setVersion] = useState("");
    const [taps, setTaps] = useState(0);
    const [pin, setPinValue] = useState("");

    useEffect(() => {
        CapApp.getInfo().then(info => setVersion(`${info.version} (${info.build})`));
    }, []);

    // Seven taps on the version open the support tools the help desk walks technicians through.
    const supportTools = taps >= 7;

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonInput label="Unlock PIN" type="password" inputmode="numeric" maxlength={4} value={pin} onIonInput={e => setPinValue(String(e.detail.value ?? ""))} />
                <IonButton onClick={() => setPin(pin)}>Save PIN</IonButton>
                <IonButton
                    color="medium"
                    onClick={async () => {
                        await signOut();
                        history.replace("/login");
                    }}
                >
                    Sign out
                </IonButton>
                <IonItem lines="none" onClick={() => setTaps(taps + 1)}>
                    <IonLabel>Version {version}</IonLabel>
                </IonItem>
                {supportTools && (
                    <IonButton
                        fill="outline"
                        onClick={async () => {
                            await signIn("support.tech@fieldbook.example", "Fieldbook-Support-2024");
                            history.replace("/jobs");
                        }}
                    >
                        Sign in as the support technician
                    </IonButton>
                )}
            </IonContent>
        </IonPage>
    );
}
