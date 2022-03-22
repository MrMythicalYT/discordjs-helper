import { Client, PermissionResolvable } from "discord.js"

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

export default class Command {
    public execute(client: Client, options: CommandOptions): any
}