class Args {
    #keys = []
    #values = []
    constructor(args, cmdArgs) {
        for (const arg of cmdArgs) this.#set(arg.name, args.shift())
    }
    array() {
        return [...this.values()]
    }
    *entries() {
        for (let i = 0; i < this.#keys.length; i++) {
            yield [this.#keys[i], this.#values[i]]
        }
            
    }
    *keys() {
        for (let i = 0; i < this.#keys.length; i++) {
            yield this.#keys[i]
        }
            
    }
    *values() {
        for (let i = 0; i < this.#values.length; i++) {
            yield this.#values[i]
        }
            
    }
    
    
    has(key) {
        return this.#keys.includes(key)
    }
    get(key) {
        return this.#values[this.#keys.indexOf(key)]
    }
    /**
     * 
     * @param {(val: string, key: string, map: this) => any} fn 
     * @param {any} thisArg 
     */
    forEach(fn, thisArg) {
        [...this.keys()].forEach((val) => fn.bind(thisArg ?? this, this.get(val), val, this))
    }
    
    get size() {
        return this.#keys.length
    }
    #set(key, value) {
        if (typeof key !== 'string') throw new TypeError(`Invalid type provided in key for Args.#set(). Received type ${typeof key}, required string`)
        if (typeof value !== 'string' && typeof value !== 'undefined') throw new TypeError(`Invalid type provided in value for Args.#set(). Received type ${typeof value}, required string or undefined`)
        this.#keys.push(key)
        this.#values.push(value)
    }
}
Args.prototype[Symbol.iterator] = Args.prototype.entries

module.exports = Args