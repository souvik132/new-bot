
const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys')
const figlet = require('figlet')
const chalk = require('chalk')
const moment = require('moment-timezone')
const fs = require('fs')

console.log(chalk.green(figlet.textSync("WhatsApp Bot")))

// Use auth.json for session storage
const { state, saveState } = useSingleFileAuthState('./auth.json')

async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on('creds.update', saveState)

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const from = msg.key.remoteJid
        const message = msg.message.conversation || msg.message.extendedTextMessage?.text || ""

        if (message === '.ping') {
            await sock.sendMessage(from, { text: '🏓 Pong!' })
        } else if (message === '.menu') {
            await sock.sendMessage(from, {
                text: '📜 *Menu*\n\n✅ .ping\n✅ .menu\n✅ .vv (view-once bypass)\n✅ .tagall (soon)'
            })
        } else if (message.startsWith('.vv')) {
            await sock.sendMessage(from, { text: '📸 View Once feature coming soon!' })
        }
    })
}

startBot()
