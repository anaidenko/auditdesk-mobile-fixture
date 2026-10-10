import { Camera, CameraResultType } from "@capacitor/camera";
import { IonButton, IonContent, IonPage, IonText, IonTextarea } from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { type Job, getJob } from "../services/api";
import { saveReport, sendReports } from "../services/queue";

export default function JobDetail() {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [photos, setPhotos] = useState<string[]>([]);

    useEffect(() => {
        getJob(id).then(setJob);
    }, [id]);

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({ resultType: CameraResultType.DataUrl, quality: 70 });
        if (photo.dataUrl) setPhotos([...photos, photo.dataUrl]);
    };

    const finish = async () => {
        if (!job) return;
        await saveReport({ ...job, status: "complete", report: job.report ?? "" });
        await sendReports();
    };

    if (!job) return null;
    return (
        <IonPage>
            <IonContent className="ion-padding">
                <h1>{job.customer}</h1>
                <p>{job.address}</p>
                {job.gateCode && <IonText>Gate code: {job.gateCode}</IonText>}
                <p>{job.notes}</p>
                <IonTextarea label="Report" value={job.report ?? ""} onIonInput={e => setJob({ ...job, report: String(e.detail.value ?? "") })} />
                <IonButton onClick={takePhoto}>Add photo ({photos.length})</IonButton>
                <IonButton expand="block" onClick={finish}>
                    Mark complete
                </IonButton>
            </IonContent>
        </IonPage>
    );
}
