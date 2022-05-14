import Context from "telegraf/typings/context";
import { Telegraf } from "telegraf/typings/telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

type Bot = Telegraf<Context<Update>>;
export default Bot;
