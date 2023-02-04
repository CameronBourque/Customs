import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {logDebug, logError} from "./logger.js";
import {
    createGuild,
    guildExists,
    updateRole
} from "./database/database.js";
import {Collection, Events, REST, Routes} from "discord.js";
import 'dotenv/config';
import bot from "./discord/botClient";

// Fix dirname since we can't use require
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Attach commands
bot.commands = new Collection()
let commands = []
let cmdPath = path.join(__dirname, 'commands')
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'))
if(process.platform === "win32") {
    cmdPath = 'file://' + cmdPath
}

for(const file of cmdFiles) {
    const filePath = path.join(cmdPath, file)
    const cmd = await import(filePath)

    bot.commands.set(cmd.default.data.name, cmd.default)
    commands.push(cmd.default.data.toJSON())
}

// Once bot is running we need some additional setup (e.g. deploy the commands!)
bot.once('ready', (c) => {
    logDebug(`${c.user.tag} is active!`)

    const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

    rest.put(
        Routes.applicationCommands(bot.application.id),
        { body: commands },
    ).then();
    logDebug("Commands deployed!")
});

// Login the bot
bot.login(process.env.TOKEN);


// ----------------------------------------- EVERYTHING BELOW HERE IS WHERE THE BOT IS LISTENING FOR EVENTS FROM DISCORD

// When there is an interaction, handle it
bot.on(Events.InteractionCreate, async (interaction) => {
    // If it's a command we want to process it
    if (interaction.isCommand()) {
        const cmd = bot.commands.get(interaction.commandName)
        if (cmd) {
            try {
                await cmd.execute(interaction)
            } catch(err) {
                logError(err)
                await interaction.reply({ content: 'There was an error while executing this command!',
                    ephemeral: true });
            }
        }
    }
})

// Handle role update
bot.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
    // Check if it was a name change
    if(oldRole.name !== newRole.name) {
        // Try to update the role
        let ret = await updateRole(newRole.guild.id, oldRole.name, newRole.name)
        if(ret === StatusCode.Success) {
            logDebug('Name for role ' + oldRole.name + ' changed to ' + newRole.name)
        } else if(ret === StatusCode.BadFail) { // Bad failure
            logDebug('Failed to update the role ' + oldRole.name)
        }
    }
})

// Handle role deletion
bot.on(Events.GuildRoleDelete, async (role) => {
    // Try to remove the role
    let ret = await removeRole(role.guild.id, role.name)
    if(ret === StatusCode.Success) {
        logDebug('Role ' + role.name + ' was removed')
    } else if (ret === StatusCode.BadFail) { // Bad failure
        logDebug('Failed to remove the role ' + role.name)
    }
})

// Handle joining to guild
bot.on(Events.GuildCreate, async (guild) => {
    if(!await guildExists(guild.id)) {
        await createGuild(guild.id, guild.name)
    }
})