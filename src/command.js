const Args = require("./args")
const { Permissions } = require("discord.js")
const { EventEmitter } = require("node:events")


class Command extends EventEmitter {
    #disabled = false
    /**
     * 
     * @param {import(".").Client} client 
     * @param {{name: string, args?: Array<{name: string, description?: string}>, permissions?: import("discord.js").PermissionResolvable, botPermissions?: import("discord.js").PermissionResolvable, slash?: boolean, allowDm?: boolean, description?: string, aliases?: string[]}} param1 
     */
    constructor(client, { name, args=[], permissions=[], botPermissions=[], allowDm=false, description, aliases=[] }) {
        super()
        this.listening = false;
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
         * @type {import("./client")}
         */
        this.client =  client
        /**
         * @type {boolean}
         * Whether to allow this command to be run in DM, permissions will not be checked if this is true
         */
        this.allowDm = Boolean(allowDm)
        /**
         * @type {string}
         * The description of the command
         */
        this.description = description
        /**
         * @type {string[]}
         * Aliases for this command
         */
        this.aliases = aliases

        client.commands.setCommand(this)
        if (client.autoListen) this.listen()
    }
    listen() {
        if (this.listening) throw new Error(`Cannot listen to command ${this.name} multiple times`)
        this.validate()
        this.client.on("messageCreate", m => {
            if (this.#disabled) return;
            this.validate()
            if (m.author.bot) return;
            let [ cmd, ...args ] = m.content.slice(this.client.prefix.length).split(/ +/g)
            if (this.name !== cmd && !this.aliases.includes(cmd)) return;
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
                args: new Args(args, this.args)
            })
        })
        this.listening = true
        return this;
    }
    validate() {
        let errors = []
        let validPrefix = this.client.prefix && typeof this.client.prefix === 'string'
        if (!validPrefix) errors.push(`Invalid prefix provided for client. Prefix must be a non-empty string`)
        if (!Array.isArray(this.aliases)) errors.push(`Invalid type for aliases. It must be an array of strings`)
        else { 
            this.aliases.forEach?.((a, i) => {
            let valid = typeof a === 'string'
            if (!valid) errors.push(`Invalid type for alias (index ${i}). It must be a string`)
        })
    }
    if (!Array.isArray(this.args)) errors.push(`Invalid type for args. It must be an array of strings`)
        this.args.forEach?.((a, i) => {
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
    setName(name) {
        this.name = name
        this.validate()
        return this;
    }
    setDescription(desc) {
        this.description = desc
        this.validate()
        return this;
    }
    setAllowDm(bool) {
        this.allowDm = bool
        this.validate()
        return this;
    }
    setArgs(args) {
        this.args = args
        this.validate()
        return this;
    }
    addArgs(...args) {
        args.flat(Infinity).forEach((a) => this.args.push(a))
        this.validate()
        return this;
    }
    deleteArg(argName) {
        if (!this.args.find(a => a.name === argName)) return this;
        this.args.splice(this.args.findIndex(a => a.name === argName), 1)
        this.validate()
        return this;
    }
    clearArgs() {
        this.args = []
        this.validate()
        return this;
    }
    addAliases(...aliases) {
        aliases.flat(Infinity).forEach((a) => this.aliases.push(a))
        this.validate()
        return this;
    }
    deleteAlias(alias) {
        if (!this.aliases.includes(alias)) return this;
        this.aliases.splice(this.aliases.indexOf(alias), 1)
        this.validate()
        return this;
    }
    setAliases(aliases) {
        this.aliases = aliases
        this.validate()
        return this;
    }
    setPermissions(permission) {
        this.permissions = new Permissions(permission)
        this.validate()
        return this;
    }
    addPermissions(...permissions) {
        this.permissions = this.permissions.add(permissions)
        this.validate()
        return this;
    }
    setBotPermissions(permission) {
        this.botPermissions = new Permissions(permission)
        this.validate()
        return this;
    }
    addBotPermissions(...permissions) {
        this.botPermissions = this.permissions.add(permissions)
        this.validate()
        return this;
    }
}

module.exports = Command