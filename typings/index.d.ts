import { Client as C, PermissionResolvable } from "discord.js"

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
    slash?: boolean, 
    allowDm?: boolean
    description?: string
}

export class Command {
    public execute(client: C, options: CommandOptions): any
}

export class Client extends C {
    public prefix: string
}