import { Client as C, CommandInteraction, GuildMember, Message, PermissionResolvable } from "discord.js"
import { EventEmitter } from "node:events"
import { Permissions } from "discord.js"

export class Args extends Map {
    public set(): void
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
    public emit<E extends keyof Events>(eventName: E, ...args: Events[E]): this
    public validate(): void
    public listen(): this
    public readonly disabled: boolean
    public setDisabled(d?: boolean): this
    public name: string
    public args?: Arg[]
    public permissions?: Permissions
    public botPermissions?: Permissions
    //slash?: boolean, 
    public allowDm?: boolean
    public description?: string
}

export class Client extends C {
    public prefix: string
}