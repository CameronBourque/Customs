import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from "node:url";
import {REST, Routes} from "discord.js";
import bot from "../botClient";

// Fix dirname since we can't use require
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commands = []
let cmdPath = path.join(__dirname, 'commands')
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'))
if(process.platform === "win32") {
    cmdPath = 'file://' + cmdPath
}

for(const file of cmdFiles) {
    const filePath = path.join(cmdPath, file)
    const cmd = await import(filePath)

    commands.push(cmd.default.data.toJSON())
}

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

await rest.put(
    Routes.applicationGuildCommands(bot.application.id, process.env.GUILD_ID),
    { body: commands },
);