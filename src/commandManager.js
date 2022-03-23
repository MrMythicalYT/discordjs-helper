class CommandManager {
    /**
     * @type {import("./command")[]}
     */
    #commands = []
    /**
     * 
     * @param {import("./client")} client 
     */
    constructor(client) {
        this.client = client
    }
    setCommand(command) {
        if (!(command instanceof require("./command"))) throw new TypeError(`Invalid command provided for setCommand()`)
        this.#commands.push(command)
        return command;
    }
    disableCommand(command) {
        if (command instanceof require("./command")) return command.setDisabled(true)
        let cmd = this.#commands.find(c => c.name === command)
        if (cmd) return cmd.setDisabled(true)
        else throw new Error(`Could not find command ${command} to disable it`)
    }
    array({ type } = {}) {
        if (!type) return this.#commands
        if (type === "ALIASES") return this.#commands.map(c => c.aliases)
        if (type === "NAME") return this.#commands.map(c => c.name)
        return this.#commands
    }
}

module.exports = CommandManager