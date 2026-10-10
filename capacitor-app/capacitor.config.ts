import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.fieldbook.app",
    appName: "Fieldbook",
    webDir: "dist",
    loggingBehavior: "production",
    server: {
        url: "http://192.168.1.20:5173",
        cleartext: true,
        allowNavigation: ["*"]
    },
    plugins: {
        Camera: { saveToGallery: false }
    }
};

export default config;
