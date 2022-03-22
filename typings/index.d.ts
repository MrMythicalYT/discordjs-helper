import { Client as C, CommandInteraction, Message, PermissionResolvable } from "discord.js"

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

export class Command {
    public constructor(client: C, options: CommandOptions)
    public execute(options: CommandData): any
    public validate(): void
    public listen(): void
}

export class Client extends C {
    public prefix: string
}