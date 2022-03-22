class Command {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {{name: string, args?: Array<{name: string, description?: string}>, permissions?: import("discord.js").PermissionResolvable, botPermissions?: import("discord.js").PermissionResolvable, slash?: boolean, allowDm?: boolean, description?: string}} param1 
     */
    constructor(client, { name, args=[], permissions=0, botPermissions=0, slash=false, allowDm=false, description }) {
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
         * @type {boolean}
         * Whether this command is a slash command
         */
        this.slash = slash
        /**
         * @type {import("discord.js").Client}
         */
        this.client =  client
        /**
         * @type {boolean}
         * Whether to allow this command to be run in DM, permissions will not be checked if this is true
         */
        this.allowDm = allowDm
    }
    listen(execute) {
        this.execute && (this.execute ??= execute);
        if (typeof this.execute !== 'function') throw new TypeError('execute must be type function')
        this.slash ? this.client.on("messageCreate", m => {
            if (!m.guild && !this.allowDm) return;
            if (m.member?.permissions && !m.member.permissions.has(this.permissions)) {
                if (typeof this.missingPerms !== 'function') throw new TypeError('missingPerms must be type function')
                try {
                    
                    this.missingPerms(this.permissions, this.botPermissions)
                } catch {

                }
            }
            execute({
                msg: m,
                command: this,
                args: new Args(m.content.slice(this.name.length).split(/ +/g), this.args)
            })
        }) : this.client.on("interactionCreate", i => {
            execute(i, this)
        })
    }
}

module.exports = Command