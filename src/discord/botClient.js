// Setup intents and create bot
import {Client, IntentsBitField} from "discord.js";

const botIntents = new IntentsBitField();
botIntents.add(IntentsBitField.Flags.Guild, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions)
const bot = new Client({ intents: botIntents });

export default bot;