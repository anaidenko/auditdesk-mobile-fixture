import { IonContent, IonItem, IonLabel, IonList, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";

import { api } from "../services/api";

interface Article {
    title: string;
    url: string;
}

/** Manufacturers' manuals and the company's how-tos, opened in the app so technicians keep their place. */
export default function Help() {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        api<Article[]>("/help/articles").then(setArticles);
    }, []);

    return (
        <IonPage>
            <IonContent>
                <IonList>
                    {articles.map(article => (
                        <IonItem key={article.url} button onClick={() => (window.location.href = article.url)}>
                            <IonLabel>{article.title}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
}
