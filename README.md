# discordjs-helper
Easy developing in discord.js

# This package is still under development

There may be a lot of bugs using this package

Example:
```js
const { Intents } = require("discord.js")
const helper = require("@mrmythical/discordjs-helper")
const client = new helper.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
client.prefix = '!'
const command = new helper.Command(client, {
    name: "test"
})
command.execute = ({ msg }) => {
    msg.reply("Success!")
}
command.listen()
client.login()
```
Sending `!test` should send back `Success!` with the bot!