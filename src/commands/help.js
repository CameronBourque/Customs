import {displayHelp, notifyProcessing} from "../discord/messageSender.js";
import {SlashCommandBuilder} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides some information about the bot'),
    async execute(cmd) {
        await notifyProcessing(cmd)

        await displayHelp(cmd)
    }
}
