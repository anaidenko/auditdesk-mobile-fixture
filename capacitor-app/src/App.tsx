import { App as CapApp } from "@capacitor/app";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";

import Help from "./pages/Help";
import JobDetail from "./pages/JobDetail";
import Jobs from "./pages/Jobs";
import Lock from "./pages/Lock";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import { completeJob } from "./services/api";

/** Job links that dispatchers text to technicians: fieldbook://job/<id>, with ?action=complete from the job-done reminder. */
async function openJobLink(url: string) {
    const link = new URL(url);
    if (link.protocol !== "fieldbook:" || link.hostname !== "job") return;
    const id = link.pathname.replace(/^\//, "");
    if (link.searchParams.get("action") === "complete") await completeJob(id);
    window.location.hash = "";
    window.history.pushState({}, "", `/jobs/${id}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function App() {
    useEffect(() => {
        const listener = CapApp.addListener("appUrlOpen", event => openJobLink(event.url));
        // Back from the background: the PIN screen, so a phone left in a van does not show the day's jobs.
        const resume = CapApp.addListener("resume", () => {
            window.history.pushState({}, "", "/lock");
            window.dispatchEvent(new PopStateEvent("popstate"));
        });
        return () => {
            listener.then(l => l.remove());
            resume.then(l => l.remove());
        };
    }, []);

    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/jobs" component={Jobs} />
                    <Route exact path="/jobs/:id" component={JobDetail} />
                    <Route exact path="/lock" component={Lock} />
                    <Route exact path="/help" component={Help} />
                    <Route exact path="/settings" component={Settings} />
                    <Redirect exact from="/" to="/jobs" />
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
}
