import publishQuote from "../publishQuote.ts";
import { Cron, repeatUntilNoError } from "../deps.ts";
import { PUBLICATION_HOUR, TIMEZONE } from "../constants.ts";

export const publishQuoteCron = new Cron(`0 ${PUBLICATION_HOUR} * * *`, { timezone: TIMEZONE }, () =>
  repeatUntilNoError(publishQuote, -1, 1)
);
