class Command {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {{name: string, args?: Array<{name: string, description?: string}>, permissions?: import("discord.js").PermissionResolvable, botPermissions?: import("discord.js").PermissionResolvable, slash?: boolean, allowDm?: boolean, description?: string}} param1 
     */
    constructor(client, { name, args=[], permissions=0, botPermissions=0, allowDm=false, description }) {
        this.execute = function () {
            console.warn("Executed empty command, this may need to be fixed. Set `execute` property of the command")
        }
        this.missingPerms = function() {
            console.warn("Executed command with missing permissions, but function not set for missing permissions. Set `missingPerms` property of the command")
        }
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
         * @type {import("discord.js").PermissionResolvable}
         * The permissions the member needs
         */
        this.permissions = permissions
        /**
         * @type {import("discord.js").PermissionResolvable}
         * The permissions the bot needs
         */
        this.botPermissions = botPermissions
        
        /**
         * @type {import("discord.js").Client}
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
    listen(execute) {
        this.validate()
        this.execute && (this.execute ??= execute);
        if (typeof this.execute !== 'function') throw new TypeError('execute must be type function')
        this.client.on("messageCreate", m => {
            this.validate()
            if (!m.content.startsWith(this.client.prefix + this.name))
            if (!m.guild && !this.allowDm) return;
            if (m.member && !m.member.permissions.has(this.permissions)) {
                this.missingPerms(this.permissions, this.botPermissions)
            }
            execute({
                msg: m,
                command: this,
                args: new Args(m.content.slice(this.name.length).split(/ +/g), this.args)
            })
        })
        
    }
    validate() {
        let errors = []
        let validPrefix = this.client.prefix && typeof this.client.prefix === 'string'
        if (!validPrefix) errors.push(`Invalid prefix provided for client. Prefix must be a non-empty string`)
        let validExecute = typeof this.execute === 'function'
        if (!validExecute) errors.push(`Invalid type for execute function. Received type ${typeof this.execute}`)
        let validMissingPerms = typeof this.missingPerms === 'function'
        if (!validMissingPerms) errors.push(`Invalid type for missingPerms function. Received ${typeof this.missingPerms}`)
        this.args.forEach((a, i) => {
            let nameType = a.name && typeof a.name === 'string'
            let descType = a.description == null ? true : typeof a.description === 'string'
            if (!nameType) errors.push(`Invalid type for arg name (index ${i}). Names must be non-empty strings`)
            if (!descType) errors.push(`Invalid type for arg description (index ${i}). Descriptions must either be nullish or a string`)
        })
        if (errors.length) throw new Error(`Validation failed:\n${errors.join('\n')}`)
    }
}

module.exports = Command