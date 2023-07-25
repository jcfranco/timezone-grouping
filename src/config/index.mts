import type { SupportedDateEngine } from "../interfaces.d.ts";

export { cityTranslations } from './cities.mjs';
export { database } from "./database.mjs";

const now = new Date();
export const START_DATE = now.toISOString();
export const NUM_DAYS = 365;

export const DATE_ENGINE: SupportedDateEngine = "moment";

