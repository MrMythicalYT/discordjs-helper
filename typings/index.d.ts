import { Client as C, ClientOptions as CO, CommandInteraction, GuildMember, Message, PermissionResolvable, RecursiveArray } from "discord.js"
import { EventEmitter } from "node:events"
import { Permissions } from "discord.js"

export class Args {
    constructor(args: string[], cmdArgs: Arg[])
    public values(): IterableIterator<string>
    public keys(): IterableIterator<string>
    public forEach(fn: (val: string, key: string, map: this) => any, thisArg?: any): void
    public entries(): IterableIterator<[string, string]>
    public array(): string[]
    public get(key: string): string
}

declare type Arg = {
    name: string
    description?: string
}

declare interface CommandOptions {
    name: string,
    args?: Arg[],
    permissions?: PermissionResolvable,
    botPermissions?: PermissionResolvable, 
    //slash?: boolean, 
    allowDm?: boolean
    description?: string
    aliases?: string[]
}

export type CommandData = {
    msg: Message
    command: Command
    args: Args
    interaction: CommandInteraction
}

declare interface Events {
    missingPerms: [{
        member: GuildMember
        msg: Message
        requiredPerms: PermissionResolvable
        type: "BOTH" | "BOT" | "MEMBER"
        command: Command
    }]
    execute: [{
        msg: Message
        command: Command
        args: Args
    }]
}

export class Command extends EventEmitter {
    public constructor(client: C, options: CommandOptions)
    public on<E extends keyof Events>(eventName: E, listener: (...args: Events[E]) => any): this
    public emit<E extends keyof Events>(eventName: E, ...args: Events[E]): boolean
    public validate(): void
    public listen(): this
    public readonly disabled: boolean
    public setDisabled(d?: boolean): this
    public setName(name: string): this
    public setDescription(desc: string): this
    public setPermissions(permission: PermissionResolvable): this
    public addPermissions(...permissions: PermissionResolvable[]): this
    public setBotPermissions(permission: PermissionResolvable): this
    public addBotPermissions(...permissions: PermissionResolvable[]): this
    public addAliases(...aliases: RecursiveArray<string>): this
    public setAliases(aliases: string[]): this
    public deleteAlias(alias: string): this
    public clearArgs(): this
    public deleteArg(arg: string): this
    public addArgs(...args: RecursiveArray<string>): this
    public setArgs(args: Arg[]): this
    public setAllowDm(bool: boolean): this
    public name: string
    public args?: Arg[]
    public permissions?: Permissions
    public botPermissions?: Permissions
    //slash?: boolean, 
    public allowDm?: boolean
    public description?: string
    public aliases: string[]
    public listening: boolean
    public client: Client
}

declare type ArrayType = "ALIAS" | "COMMAND" | "NAME"

declare interface ArrayOptions {
    type: ArrayType
}

declare type Types = {
    ALIAS: string[][]
    COMMAND: Command[]
    NAME: string[]
}

declare class CommandManager {
    public array<T extends ArrayType>(options: ArrayOptions & { type: T }): Types[T]
    public array(): Command[]
    public setCommand(command: Command): Command
    public disableCommand(command: Command | string): Command
}

export interface ClientOptions extends CO {
    autoListen: boolean
}

export class Client extends C {
    constructor(options: ClientOptions)
    public prefix: string
    public commands: CommandManager
}

export { default as Discord } from "discord.js"

export const version: string