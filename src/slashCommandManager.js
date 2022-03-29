class SlashCommandManager {
    #commands = []
    #lastRequestDate = null
    /**
     * 
     * @param {import("./client")} client 
     */
    constructor(client) {
        this.client = client
    }
    async postAll(guildId) {
        if (!this.client.isReady()) throw new Error("Cannot post commands with unready client")
        if (this.#lastRequestDate && (Date.now() - this.#lastRequestDate < 3000)) throw new Error(`Do not make requests multiple times within a short time. Instead, do it all in one request`)
        let target = this.client.guilds.cache.get(guildId)?.commands ?? this.client.application.commands
        this.#lastRequestDate = Date.now()
        let currentCmds = await target.fetch()
        return target.set([
            ...currentCmds,
            ...this.#commands
        ])
    }
    async deleteAll(guildId) {
        if (!this.client.isReady()) throw new Error("Cannot delete commands with unready client")
        if (this.#lastRequestDate && (Date.now() - this.#lastRequestDate < 3000)) throw new Error(`Do not make requests multiple times within a short time`)
        let target = this.client.guilds.cache.get(guildId)?.commands ?? this.client.application.commands
        this.#lastRequestDate = Date.now()
        return target.set([])
    }
    async fetchAll(guildId) {
        if (!this.client.isReady()) throw new Error("Cannot get commands with unready client")
        if (this.#lastRequestDate && (Date.now() - this.#lastRequestDate < 3000)) throw new Error(`Do not make requests multiple times within a short time`)
        let target = this.client.guilds.cache.get(guildId)?.commands ?? this.client.application.commands
        this.#lastRequestDate = Date.now()
        return target.fetch()
    }
    async listAll(guildId) {
        if (!this.client.isReady()) throw new Error("Cannot get commands with unready client")
        if (this.#lastRequestDate && (Date.now() - this.#lastRequestDate < 3000)) throw new Error(`Do not make requests multiple times within a short time`)
        let target = this.client.guilds.cache.get(guildId)?.commands ?? this.client.application.commands
        this.#lastRequestDate = Date.now()
        return target.fetch().then(commands => {
            let obj = {}
            for (const [ key, { name }] of commands) {
                obj[name] = key
            }
            return obj;
        })
    }
    _push(data) {
        this.#commands.push(data.toJSON())
    }
}

module.exports = SlashCommandManager