const { Client: C } = require("discord.js")

class Client extends C {
    #_prefix = null
    constructor(options) {
        super(options)
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