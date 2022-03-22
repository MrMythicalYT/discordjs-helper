class Args extends Map {
    constructor(args, cmdArgs) {
        super()
        for (const arg of cmdArgs) this.set(arg.name, args.shift())
        this.set = function () {}
    }
}