const Args = require("./args")
const { Permissions, Client } = require("discord.js")
const { EventEmitter } = require("node:events")

class Command extends EventEmitter {
    #disabled = false
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {{name: string, args?: Array<{name: string, description?: string}>, permissions?: import("discord.js").PermissionResolvable, botPermissions?: import("discord.js").PermissionResolvable, slash?: boolean, allowDm?: boolean, description?: string}} param1 
     */
    constructor(client, { name, args=[], permissions=[], botPermissions=[], allowDm=false, description }) {
        super()
        /**
         * @type {string}
         * The name of the command
         */
        this.name = name
        /**
         * @type {Array<{name: string, description?: string}>}
         */
        this.args = args
        /**
         * @type {Permissions}
         * The permissions the member needs
         */
        this.permissions = new Permissions(permissions)
        /**
         * @type {Permissions}
         * The permissions the bot needs
         */
        this.botPermissions = new Permissions(botPermissions)
        
        /**
         * @type {Client}
         */
        this.client =  client
        /**
         * @type {boolean}
         * Whether to allow this command to be run in DM, permissions will not be checked if this is true
         */
        this.allowDm = allowDm
        /**
         * @type {string}
         * The description of the command
         */
        this.description = description
    }
    listen() {
        this.validate()
        this.client.on("messageCreate", m => {
            if (this.#disabled) return;
            this.validate()
            if (m.author.bot) return;
            if (!m.content.startsWith(this.client.prefix + this.name)) return;
            if (!m.guild && !this.allowDm) return;
            if (m.member && !m.member.permissions.has(this.permissions)) {
                return this.emit("missingPerms", {
                    msg: m,
                    member: m.member,
                    requiredPerms: this.permissions,
                    type: m.guild?.me.permissions.has(this.botPermissions) ? "BOTH" : "MEMBER"
                })
            } else if (m.guild && !m.guild?.me.permissions.has(this.botPermissions)) {
                return this.emit("missingPerms", {
                    msg: m,
                    member: m.member,
                    requiredPerms: this.permissions,
                    type: "BOT",
                    command: this
                })
            }
            this.emit("execute", {
                msg: m,
                command: this,
                args: new Args(m.content.slice(this.client.prefix.length + this.name.length + 1).split(/ +/g), this.args)
            })
        })
        return this;
    }
    validate() {
        let errors = []
        let validPrefix = this.client.prefix && typeof this.client.prefix === 'string'
        if (!validPrefix) errors.push(`Invalid prefix provided for client. Prefix must be a non-empty string`)
        this.args.forEach((a, i) => {
            let nameType = a.name && typeof a.name === 'string'
            let descType = a.description == null ? true : typeof a.description === 'string'
            if (!nameType) errors.push(`Invalid type for arg name (index ${i}). Names must be non-empty strings`)
            if (!descType) errors.push(`Invalid type for arg description (index ${i}). Descriptions must either be nullish or a string`)
        })
        if (errors.length) throw new Error(`Validation failed:\n${errors.join('\n')}`)
    }
    get disabled() {
        return this.#disabled
    }
    setDisabled(d=true) {
        this.#disabled = !!d
        return this;
    }
}

module.exports = Command