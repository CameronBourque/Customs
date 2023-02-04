import bot from "../botClient";

// Clear commands from provided guild
bot.once('ready', () => {
    bot.guilds.cache.get(process.env.GUILD_ID).commands.set([])
})