const { EventEmitter } = require("node:events")

class SlashCommand extends EventEmitter {
    constructor(client, { name, description, options, defaultPermission=true, allowDm=false }) {
        super()
        this.listening = false
        /**
         * @type {import(".").Client}
         */
        this.client = client
        this.name = name
        this.description = description
        this.options = options
        this.defaultPermission = defaultPermission
        this.allowDm = Boolean(allowDm)
        if (client.autoListen) this.listen()
        client.slashCommands._push(this)
    }
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            defaultPermission: this.defaultPermission
        }
    }
    listen() {
        if (this.listening) throw new Error(`Cannot listen to command ${this.name} multiple times`)
        this.validate()
        this.client.on("interactionCreate", i => {
            this.validate()
            if (!i.isCommand()) return;
            if (i.commandName !== this.name) return;
            if (!i.guild && !this.allowDm) return;
            this.emit("execute", {
                interaction: i,
                command: this,
                args: i.options
            })
        })
    }
    validate() {
        let errors = []
    if (!Array.isArray(this.options)) errors.push(`Invalid type for options. It must be an array of options`)
        this.options?.forEach?.((a, i) => {
            let nameType = a.name && typeof a.name === 'string'
            let descType = a.description == null ? true : typeof a.description === 'string'
            if (!nameType) errors.push(`Invalid type for option name (index ${i}). Names must be non-empty strings`)
            if (!descType) errors.push(`Invalid type for option description (index ${i}). Descriptions must be a non-empty string`)
        })
        if (errors.length) throw new Error(`Validation failed:\n${errors.join('\n')}`)
    }
}

module.exports = SlashCommand