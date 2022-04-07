# discord.js-helper
Easy developing in discord.js

# Bugs
Please go to the issues page on github to submit a bug

Example:
```js
const { Discord, Client, Command } = require("@mrmythical/discord.js-helper")
const { Intents } = Discord
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    autoListen: true
})

client.prefix = '!'
const command = new Command(client, {
    name: "test",
    aliases: ["t"]
})
command.on("execute", ({ msg }) => {
  msg.reply("Success!")
})

client.on("ready", () => console.log("Ready"))

client.login(token)
```
Sending `!test` or `!t` should send back `Success!` with the bot!
---
You can contribute on the [GitHub repository](https://github.com/MrMythicalYT/discordjs-helper)

# Slash command support is here with v2!
```js
const { Client, Discord, SlashCommand } = require(".");
const { Intents } = Discord;
const client = new Client({
    intents: [Intents.FLAGS.GUILDS],
    autoListen: true
});

const command = new SlashCommand(client, {
    name: "test",
    options: [{
        name: "test",
        description: "A test",
        type: "STRING"
    }],
    description: "test cmd"
})
client.on("ready", async () => {
  // ONLY RUN THIS ONCE WHEN YOU MODIFY COMMANDS OR YOU WILL LIKELY GET RATELIMITED
    await client.slashCommands.postAll(guildId) // guildId is not required, not passing guildId will make it post to global comands
    console.log("ready")
})

command.on("execute", async ({ interaction }) => {
    await interaction.reply(`This is a reply to the ${interaction.commandName} slash command!`)
})

client.login(token);
```
# Docs?
There are no docs yet, but hopefully this helps:

## Client
Regular discord.js with a few changes, including `autoListen` in `ClientOptions` and being able to set the prefix. There is also `.commands` which returns a `CommandManager`

## Args
Args are like js maps, but are readonly. They are mapped by name and user input.

## Command and CommandManager
Commands are easy to use and auto listen if set in client options. `autoListen` in the client options is true by default. CommandManagers help you with managing commands, like listing them, deleting them, etc.

## SlashCommand and SlashCommandManager
SlashCommands are almost like Commands, but aren't as flexible as message commands and you can access them on Discord by typing `/`. SlashCommandManagers hold these commands. Please only run the methods responsibly. Only run them if needed, or you may get ratelimited
