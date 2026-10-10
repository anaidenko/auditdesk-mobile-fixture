import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";

import { type Job, listJobs } from "../services/api";

export default function Jobs() {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        listJobs().then(setJobs);
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Today's jobs</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {jobs.map(job => (
                        <IonItem key={job.id} routerLink={`/jobs/${job.id}`}>
                            <IonLabel>
                                <h2>{job.customer}</h2>
                                <p>{job.address}</p>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
}
