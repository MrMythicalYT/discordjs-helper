const { Client: C } = require("discord.js")
const CommandManager = require("./commandManager")

class Client extends C {
    /**
     * @type {string}
     */
    #_prefix = null
    constructor(options) {
        super(options)
        this.autoListen = Boolean(options?.autoListen ?? true)
        this.commands = new CommandManager(this)
    }
    login(t) {
        if (!this.#_prefix) throw new TypeError('Prefix must be set for the client')
        super.login(t)
    }
    get prefix() {
        return this.#_prefix
    }
    set prefix(p) {
        if (typeof p !== 'string' || p.length < 1) throw new TypeError('Prefix must be a non-empty string')
        this.#_prefix = p
    }
}

module.exports = Client