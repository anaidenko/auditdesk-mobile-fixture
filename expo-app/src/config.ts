import Constants from "expo-constants";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://api.larder.example";

// Product photos come from the shops' own image server.
export const IMAGE_BASE = "http://img.larder.example";

export const PAYWISE_URL = "https://api.paywise.example/v2";
export const PAYWISE_KEY = process.env.EXPO_PUBLIC_PAYWISE_SERVER_KEY ?? "";

export const ANALYTICS_URL = "https://collect.metricly.example/v1/events";

export const APP_VERSION = Constants.expoConfig?.version ?? "0.0.0";
