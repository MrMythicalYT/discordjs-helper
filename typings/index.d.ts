import { ApplicationCommand, ApplicationCommandOption, ApplicationCommandOptionData, Client as C, ClientOptions as CO, Collection, CommandInteraction, GuildMember, Message, PermissionResolvable, RecursiveArray, Snowflake } from "discord.js"
import { EventEmitter } from "node:events"
import { Permissions } from "discord.js"

export class Args {
    public constructor(args: string[], cmdArgs: Arg[])
    public values(): Generator<string>
    public keys(): Generator<string>
    public forEach(fn: (val: string, key: string, map: this) => any, thisArg?: any): void
    public entries(): Generator<[string, string]>
    public array(): string[]
    public get(key: string): string
    public has(key: string): boolean
    public size: number
    [Symbol.iterator]: Generator<[string, string]>
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

declare interface SlashCommandOptions { 
    name: string
    description: string
    options: ApplicationCommandOptionData
    defaultPermission: boolean
    allowDm: boolean
}

export type CommandData = {
    msg: Message
    command: Command
    args: Args
}
export type SlashCommandData = {
    interaction: CommandInteraction
    command: Command
    args: typeof CommandInteraction.prototype.options
}

declare interface Events {
    missingPerms: [{
        member: GuildMember
        msg: Message
        requiredPerms: PermissionResolvable
        type: "BOTH" | "BOT" | "MEMBER"
        command: Command
    }]
    execute: [CommandData]
}

declare interface SlashEvents {
    execute: [SlashCommandData]
}

export class Command extends EventEmitter {
    public constructor(client: C, options: CommandOptions)
    public on<E extends keyof Events>(eventName: E, listener: (...args: Events[E]) => any): this
    public once<E extends keyof Events>(eventName: E, listener: (...args: Events[E]) => any): this
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

export class SlashCommand extends EventEmitter {
    public constructor(client: Client, options: SlashCommandOptions)
    public toJSON(): object
    public validate(): void
    public listening: boolean
    public client: Client
    public name: string
    public description: string
    public options: typeof CommandInteraction.prototype.options
    public defaultPermission: boolean
    public allowDm: boolean
    public on<E extends keyof SlashEvents>(eventName: E, listener: (...args: SlashEvents[E]) => any): this
    public once<E extends keyof SlashEvents>(eventName: E, listener: (...args: SlashEvents[E]) => any): this
    public emit<E extends keyof SlashEvents>(eventName: E, ...args: SlashEvents[E]): boolean
}

export class SlashCommandManager {
    public postAll(guildId?: Snowflake): Promise<ApplicationCommand[]>
    public deleteAll(guildId?: Snowflake): Promise<any[]>
    public fetchAll(guildId?: Snowflake): Promise<Collection<Snowflake, ApplicationCommand>>
    public listAll(guildId?: Snowflake): Promise<Record<string, Snowflake>>
    private _push(): void
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
    public slashCommands: SlashCommandManager
}

export { default as Discord } from "discord.js"

export const version: string