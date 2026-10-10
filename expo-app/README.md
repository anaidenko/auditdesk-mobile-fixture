# Larder

Larder is a grocery delivery app for independent food shops. Customers browse the shops near
them, build a basket, pay with a saved card and follow their order to the door. Orders placed
without a connection are kept on the phone and sent when the app is back online.

## Stack

Expo SDK 52 with Expo Router, React Native 0.76, the Larder API (a separate service), the
Paywise card-payments API and the Metricly analytics collector.

## Running locally

```sh
npm install
npx expo start
```

Sign-in links sent by email open the app through the `larder://` scheme.
