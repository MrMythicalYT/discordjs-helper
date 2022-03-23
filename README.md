# discord.js-helper
Easy developing in discord.js

# Bugs
Please go to the issues page on github to submit a bug

Example:
```js
const helper = require("@mrmythical/discord.js-helper")
const { Discord } = helper
const { Intents } = Discord
const client = new helper.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    autoListen: true
})

client.prefix = '!'
const command = new helper.Command(client, {
    name: "test",
    aliases: ["t"]
})
command.on("execute", data => {
  data.msg.reply("Success!")
})

client.on("ready", () => console.log("Ready"))
```
Sending `!test` or `!t` should send back `Success!` with the bot!
---
You can contribute on the [GitHub repository](https://github.com/MrMythicalYT/discordjs-helper)

# Docs?
There are no docs yet, but hopefully this helps:

## Client
Regular discord.js with a few changes, including `autoListen` in `ClientOptions` and being able to set the prefix. There is also `.commands` which returns a `CommandManager`

## Args
Args are like js maps, but are readonly. They are mapped by name and user input.

## Command and CommandManager
Commands are easy to use and auto listen if set in client options. `autoListen` in the client options is true by default. CommandManagers help you with managing commands, like listing them, deleting them, etc.


Slash command support coming soon!