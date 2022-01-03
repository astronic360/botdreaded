import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'demote',
            description: 'demotes the mentioned users',
            category: 'moderation',
            usage: `${client.config.prefix}demote [mention | @tag]`,
            baseXp: 0
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply(`How can I demote someone without being an admin?`)
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length) return void M.reply(`Should I ${this.config.command} air💔?`)
        M.mentioned.forEach(async (user) => {
            const usr = this.client.contacts[user]
            const username = usr.notify || usr.vname || usr.name || user.split('@')[0]
            if (!M.groupMetadata?.admins?.includes(user)) M.reply(`✖ Skipped *${username}* as they're not an admin`)
            else if (user !== this.client.user.jid) {
                await this.client.groupDemoteAdmin(M.from, [user])
                M.reply(` *${username}* is now a normal member 😂, so sad`)
            }
        })
    }
}
