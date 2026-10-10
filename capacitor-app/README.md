# Fieldbook

Fieldbook is the job app for a home-repair company's field technicians. Each morning a
technician sees the day's jobs, opens a job to read the customer's notes and the gate code,
takes photos, and marks the job complete. Reports written without signal are kept on the phone
and sent when the connection comes back. Dispatchers send job links by text message.

## Stack

Ionic React 8 with Capacitor 6 (Android and iOS), Vite, and the Fieldbook API (a separate
service).

## Running locally

```sh
npm install
npm run build
npx cap sync
npx cap run android
```
