import { IonButton, IonContent, IonInput, IonPage, IonText } from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import { checkPin } from "../services/pin";

export default function Lock() {
    const history = useHistory();
    const [pin, setPin] = useState("");
    const [wrong, setWrong] = useState(false);

    const unlock = async () => {
        if (await checkPin(pin)) history.replace("/jobs");
        else setWrong(true);
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonInput label="PIN" type="password" inputmode="numeric" maxlength={4} value={pin} onIonInput={e => setPin(String(e.detail.value ?? ""))} />
                {wrong && <IonText color="danger">Wrong PIN.</IonText>}
                <IonButton expand="block" onClick={unlock}>
                    Unlock
                </IonButton>
            </IonContent>
        </IonPage>
    );
}
