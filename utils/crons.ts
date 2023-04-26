import { Cron } from "../deps.ts";
import publishQuote from "../publishQuote.ts";
import { PUBLICATION_HOUR, TIMEZONE } from "../constants.ts";

export const publishQuoteCron = new Cron(`0 ${PUBLICATION_HOUR} * * *`, { timezone: TIMEZONE }, publishQuote);
