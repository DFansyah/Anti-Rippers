require('./settings')

const {
    WA_DEFAULT_EPHEMERAL,
    getAggregateVotesInPollMessage,
    generateWAMessageContent,
    generateWAMessage,
    downloadContentFromMessage,
    areJidsSameUser,
    getContentType
} = global.baileys
const {
    generateWAMessageFromContent,
    proto,
    prepareWAMessageMedia
} = require("@whiskeysockets/baileys")
const fs = require('fs')
const cron = require('node-cron')
const util = require('util')
const chalk = require('chalk')
const os = require('os')
const speed = require('performance-now')
const axios = require('axios')
const fsx = require('fs-extra')
const FormData = require('form-data')
const cheerio = require('cheerio')
const crypto = require('crypto')
const https = require('https')
const { fileTypeFromBuffer } = require('file-type')
const PhoneNumber = require('awesome-phonenumber')
const nou = require("node-os-utils")
const path = require('path')
const { pipeline } = require('stream')
const { promisify } = require("util")
const jimp = require('jimp')
const zsExtract = require('zs-extract')
const ScammerApiReader = require('@dfansyah/scammer-api-reader')
const apiUrl = 'https://anti-ripper.my.id/api/v1' 
const reader = new ScammerApiReader(apiUrl)
const content = JSON.stringify(m.message)
const isQuotedViewonce = m.quoted ? content.includes('viewOnceMessage') ? true : false : true
const ffmpeg = require('fluent-ffmpeg')
const moment = require('moment-timezone')
const { JSDOM } = require('jsdom')
const {
    exec,
    spawn,
    execSync
} = require("child_process")
const { addExif } = require('./lib/exif')
const {
    smsg,
    tanggal,
    getTime,
    isUrl,
    sleep,
    clockString,
    runtime,
    fetchJson,
    getBuffer,
    jsonformat,
    format,
    formatp,
    parseMention,
    getRandom,
    getGroupAdmins,
    generateProfilePicture,
    toRupiah,
    shorturl,
    enumGetKey,
    sort,pickRandom,
    toNumber,
    randomNumber
} = require('./lib/myfunc')
const { color, bgcolor } = require('./lib/color')

module.exports = NXL = async (NXL, m, chatUpdate, store) => {
    try {
        const appenTextMessage = async (text, chatUpdate) => {
        	let messages = await generateWAMessage(m.chat, { text: text, mentions: m.mentionedJid }, {
        		userJid: NXL.user.id,
        		quoted: m.quoted && m.quoted.fakeObj
        	})
        	messages.key.fromMe = areJidsSameUser(m.sender, NXL.user.id)
        	messages.key.id = m.key.id
        	messages.pushName = m.pushName
        	if (m.isGroup) messages.participant = m.sender
        	let msg = {
        		...chatUpdate,
        		messages: [proto.WebMessageInfo.fromObject(messages)],
        		type: 'append'
    	}
    	NXL.ev.emit('messages.upsert', msg)
    }
    
    var body = m.mtype === 'conversation' ? m.message.conversation
    	: m.mtype === 'imageMessage' ? m.message.imageMessage.caption
    	: m.mtype === 'videoMessage' ? m.message.videoMessage.caption
    	: m.mtype === 'extendedTextMessage' ? m.message.extendedTextMessage.text
    	: m.mtype === 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId
    	: m.mtype === 'listResponseMessage' ? m.message.listResponseMessage.singleSelectReply.selectedRowId
    	: m.mtype === 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId
    	: m.mtype === 'interactiveResponseMessage' ? await appenTextMessage(JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id, chatUpdate)
    	: m.mtype === 'templateButtonReplyMessage' ? await appenTextMessage(m.msg.selectedId, chatUpdate)
    	: m.mtype === 'messageContextInfo' ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text)
    	: ''
    
        
        var budy = (typeof m.text == 'string' ? m.text : '')
        const prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!™©®Δ^βα¦|/\\©^]/gi) : '.'
        
        const Styles = (text, style = 1) => {
            var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('')
             yStr = {
                1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
             }
             var replacer = []
             xStr.map((v, i) =>
                replacer.push({
                    original: v,
                    convert: yStr[style].split('')[i]
                })
             )
             var str = text.toLowerCase().split('')
             var output = []
             str.map((v) => {
                const find = replacer.find((x) => x.original == v)
                find ? output.push(find.convert) : output.push(v)
             })
             return output.join('')
        }
        const pushname = m.pushName || "No Name"
        const isCmd = body.startsWith(prefix)
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
        const args = body.trim().split(/ +/).slice(1)
        const botNumber = await NXL.decodeJid(NXL.user.id)
        const myGroup = JSON.parse(fs.readFileSync('./database/idgrup.json').toString())
        const myGroups = m.isGroup ? myGroup.includes(m.chat) : false
        const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const text = q = args.join(" ")
        const { type, quotedMsg, mentioned, now, fromMe } = m
        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const isMedia = /image|video|sticker|audio/.test(mime)
        const from = mek.key.remoteJid
        const groupMetadata = m.isGroup ? await NXL.groupMetadata(from).catch(e => {}) : ''
        const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
        const chat = m.isGroup?[m.chat] : false
        const qmsg = (quoted.msg || quoted)
        const content = JSON.stringify(m.message)
        const numberQuery = text.replace(new RegExp("[()+-/ +/]", "gi"), "") + "@s.whatsapp.net"
        const mentionByTag = m.mtype == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == 'extendedTextMessage' && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.participant || '' : ''
        const froms = m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false) : false
        const qtod = m.quoted? "true":"false"
        
        const hariini = moment.tz('Asia/Makassar').format('dddd, DD MMMM YYYY')
        const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z')
        const tanggal2 = moment.tz('Asia/Jakarta').format('DD/MM/YY')
        const wita = moment.tz('Asia/Makassar').format('HH : mm : ss')
        
        const fnet = {
            key: {
                participant: '0@s.whatsapp.net',
                ...(m.chat ? {
                    remoteJid: `status@broadcast`
                } : {})
            },
            message: {
                locationMessage: {
                    name: `${botname}`,
                    jpegThumbnail: "",
                }
            }
        }
        
        const reply2 = (teks) => {
            NXL.sendMessage( m.chat, {
                document: fs.readFileSync("./package.json"),
                fileName: 'Anti Rippers',
                mimetype: 'application/msword',
                jpegThumbnail:fs.readFileSync("./thumb.jpg"),
                caption: `\n${teks}`,
            }, { quoted: fnet, ephemeralExpiration: 86400})
        }
        
        const reply = async (teks) => {
            const nedd = {
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: global.botname,
                        newsletterJid: global.idcennel,
                    },
                    externalAdReply: {
                        showAdAttribution: true,
                        title: `${botname}`,
                        body: foter1,
                        previewType: "VIDEO",
                        thumbnailUrl: thumbnail,
                        sourceUrl: hariini,
                    },
                },
                text: teks,
            }
            return NXL.sendMessage( m.chat, nedd, { quoted: fnet })
        }
        
        if (global.onlypc) {
            if (command&!m.isGroup){
                return reply(`Bot dalam mode private, gunakan di private chat!`)
            }
        }
        
        if (!NXL.public) {
            if (!m.key.fromMe) return
        }
        
        let rn = ['recording']
        let jd = rn[Math.floor(Math.random() * rn.length)]
        if (m.message) {
            NXL.sendPresenceUpdate('available', m.chat)
            console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32m NXL \x1b[1;37m]', time, chalk.green(budy || m.mtype), 'Dari', chalk.blue(pushname), 'Di', chalk.yellow(groupName ? groupName : 'Private Chat' ), 'args :', chalk.white(args.length))
        }
        
        if (isMedia && m.msg.fileSha256 && (m.msg.fileSha256.toString('base64') in global.db.data.sticker)) {
            let hash = global.db.data.sticker[m.msg.fileSha256.toString('base64')]
            let { text, mentionedJid } = hash
            let messages = await generateWAMessage(from, { text: text, mentions: mentionedJid }, {
                userJid: NXL.user.id,
                quoted : m.quoted && m.quoted.fakeObj
            })
            messages.key.fromMe = areJidsSameUser(m.sender, NXL.user.id)
            messages.key.id = m.key.id
            messages.pushName = m.pushName
            if (m.isGroup) messages.participant = m.sender
            let msg = {
                ...chatUpdate,
                messages: [proto.WebMessageInfo.fromObject(messages)],
                type: 'append'
            }
            NXL.ev.emit('messages.upsert', msg)
        }
        
        if (budy.startsWith('!')) {
            try {
                return reply(JSON.stringify(eval(`${args.join(' ')}`),null,'\t'))
            } catch (e) {
                reply(e)
            }
        }
        
        const sendGeekzMessage = async (chatId, message, options = {}) => {
            let generate = await generateWAMessage(chatId, message, options)
            let type2 = getContentType(generate.message)
            if ('contextInfo' in options) generate.message[type2].contextInfo = options?.contextInfo
            if ('contextInfo' in message) generate.message[type2].contextInfo = message?.contextInfo
            return await NXL.relayMessage(chatId, generate.message, { messageId: generate.key.id })
        }
        
        try {
            ppuser = await NXL.profilePictureUrl(m.sender, 'image')
        } catch (err) {
            ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
        }
        ppnyauser = await getBuffer(ppuser)
        
        try {
            let isNumber = x => typeof x === 'number' && !isNaN(x)
            let limitUser = isCreator ? 1000 : limitawal
            let balanceUser = isCreator ? 10000 : balanceawal
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object') global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.afkTime)) user.afkTime = -1
                if (!('afkReason' in user)) user.afkReason = ''
            } else global.db.data.users[m.sender] = {
                name: pushname,
                afkTime: -1,
                afkReason: '',
            }
        } catch (err) {
            console.log(err)
        }
        
        let isNumber = x => typeof x === 'number' && !isNaN(x)
        let setting = global.db.data.settings[botNumber]
        if (typeof setting !== 'object') global.db.data.settings[botNumber] = {}
        if (setting) {
            if (!isNumber(setting.status)) setting.status = 0
            if (autobio) {
                let _uptime = process.uptime() * 1000
                let uptime = clockString(_uptime)
                await NXL.updateProfileStatus(`I am ${botname} | Aktif Selama ${uptime} ⏳ | Mode : ${NXL.public ? 'Public-Mode' : 'Self-Mode'}`).catch(_ => _)
            } if (autoread) {
                NXL.readMessages([m.key])
            } else global.db.data.settings[botNumber] = {
                status: 0,
                autobio: true,
                autoread: false
            }
        }
        
        if (m.isGroup) {
        let chat = global.db.data.chats[m.chat]
        if (typeof chat !== 'object') {
            global.db.data.chats[m.chat] = {}
            chat = global.db.data.chats[m.chat]
        }
        if (!('welcome' in chat)) chat.welcome = false
        if (!('sWelcome' in chat)) chat.sWelcome = ''
        if (typeof chat.clearTime !== 'number') chat.clearTime = 0
        if (!('mute' in chat)) chat.mute = false
        if (!('autokick' in chat)) chat.autokick = false
    }
        
        Array.prototype.rendem = function rendem() {
            return this[Math.floor(Math.random() * this.length)]
        }
        
        const capital = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1)
        }
        
        const formatter = (value) => {
            return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
        
        const calculatePPN = (value) => {
            return value * 0.1
        }
        
        const removeItem = (array, item) => {
            return array.filter(elem => !(elem.jid === item.jid && elem.state === item.state))
        }
        
        const totalFitur = () =>{
            var mytext = fs.readFileSync("./case.js").toString()
            var numUpper = (mytext.match(/case '/g) || []).length
            return numUpper
        }
        
        let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
        for (let jid of mentionUser) {
            let user = global.db.data.users[jid]
            if (!user) continue
            let afkTime = user.afkTime
            if (!afkTime || afkTime < 0) continue
            let reason = user.afkReason || ''
            reply(`Jangan tag dia!
            Dia sedang AFK ${reason ? 'dengan alasan ' + reason : 'tanpa alasan'}
            Selama ${clockString(new Date - afkTime)}
            `.trim())
        }
        
        if (global.db.data.users[m.sender].afkTime > -1) {
            let user = global.db.data.users[m.sender]
            reply(`
            Telah Kembali Dari Afk ${user.afkReason ? ' Selama ' + user.afkReason : ''}
            Selama ${clockString(new Date - user.afkTime)}
            `.trim())
            user.afkTime = -1
            user.afkReason = ''
        }
        
        const dellCase = async (filePath, caseNameToRemove) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Terjadi kesalahan:', err)
                    return
                }
                const regex = new RegExp(`case\\s+'${caseNameToRemove}':[\\s\\S]*?break`, 'g')
                const modifiedData = data.replace(regex, '')
                fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
                    if (err) {
                        console.error('Terjadi kesalahan:',     err)
                        return
                    }
                    console.log(`Teks dari case '${caseNameToRemove}' telah dihapus dari file.`)
                })
            })
        }
        
        const more = String.fromCharCode(8206)
        const readmore = more.repeat(4001)
        
        //================== [ Switch Case ] ==================//
        switch(command) {
            case 'search': {
                if (!q) return reply('Masukkan nama atau nomor yang ingin dicari.')
                
                const results = await reader.search(q)
                
                if (!results || results.length === 0) {
                    return reply(`Data untuk "${q}" tidak ditemukan di database.`)
                }
                let responseText = `*🔍 Hasil Pencarian Ditemukan*\n\n`
                for (const item of results) {
                    responseText += `*Nama:* ${item.name}\n`
                    responseText += `*Kontak:* ${item.contact}\n`
                    responseText += `*Alasan:* ${item.reason}\n`
                    responseText += `*Bukti:* ${item.evidence}\n`
                    responseText += `--------------------------\n`
                }
                reply(responseText)
            }
            break
            case 'autokick': {
                if (!isCreator) return reply(mess.owner)
                if (!m.isGroup) return m.reply(mess.group)
                if (args.length < 1) return m.reply('Ketik *on* untuk mengaktifkan, atau *off* untuk menonaktifkan.')
                let chat = global.db.data.chats[m.chat]
                if (args[0] === "on") {
                    if (chat.autokick) return m.reply('Fitur Auto-Kick memang sudah aktif.')
                    if (!isBotAdmins) return reply("Jadikan bot sebagai admin terlebih dahulu.")
                    chat.autokick = true
                    m.reply('✅ Fitur *Auto-Kick Ripper* telah diaktifkan.\nMemulai pemindaian penuh...')
                    try {
                        const rippers = await reader.getAll()
                        const ripperNumbers = rippers.map(r => {
                            let num = r.contact.replace(/[^0-9]/g, '')
                            if (num.startsWith('08')) return '62' + num.substring(1)
                            return num
                        })
                        const groupMetadata = await NXL.groupMetadata(m.chat)
                        const groupParticipants = groupMetadata.participants
                        let kickedCount = 0
                        for (const member of groupParticipants) {
                            const memberNumber = member.id.split('@')[0]
                            if (ripperNumbers.includes(memberNumber)) {
                                if (member.admin !== null) continue
                                await NXL.groupParticipantsUpdate(m.chat, [member.id], 'remove')
                                kickedCount++
                                await new Promise(resolve => setTimeout(resolve, 500))
                            }
                        }
                        if (kickedCount > 0) {
                            m.reply(`✅ Pemindaian selesai. Berhasil mengeluarkan *${kickedCount}* anggota.`)
                        } else {
                            m.reply('✅ Pemindaian selesai. Grup ini bersih.')
                        }
                    } catch (error) {
                        console.error('Gagal melakukan pemindaian awal:', error)
                    }
    
                } else if (args[0] === "off") {
                    if (!chat.autokick) return m.reply('Fitur ini memang sudah tidak aktif.')
                    chat.autokick = false
                    m.reply('Sukses Mematikan Fitur Auto-Kick di grup ini.')
                } else {
                    m.reply('Perintah tidak valid. Gunakan *on* atau *off*.')
                }
            }
            break
            case 'forward':
            case 'saluran': {
                if (!isCreator) return m.reply('Fitur ini khusus untuk Tuan Saya.')
    
                if (!m.quoted) {
                    return m.reply('Perintah salah. Silakan balas pesan yang ingin Anda kirim, lalu ketik perintah ini.')
                }
                const targetJid = '120363419133479331@newsletter'
                m.reply(`Membangun ulang dan mengirim pesan ke saluran...`)
    
                try {
                    let quotedMessage = m.quoted
                    if (quotedMessage.mtype === 'conversation' || quotedMessage.mtype === 'extendedTextMessage') {
                        await NXL.sendMessage(targetJid, { text: quotedMessage.text })
    
                    } else if (quotedMessage.mtype === 'imageMessage') {
                        let media = await NXL.downloadMediaMessage(quotedMessage)
                        await NXL.sendMessage(targetJid, { 
                            image: media, 
                            caption: quotedMessage.text
                        })
    
                    } else if (quotedMessage.mtype === 'videoMessage') {
                        let media = await NXL.downloadMediaMessage(quotedMessage)
                        await NXL.sendMessage(targetJid, { 
                            video: media, 
                            caption: quotedMessage.text 
                        })
    
                    } else if (quotedMessage.mtype === 'stickerMessage') {
                        let media = await NXL.downloadMediaMessage(quotedMessage)
                        await NXL.sendMessage(targetJid, { sticker: media })
                    
                    } else if (quotedMessage.mtype === 'audioMessage') {
                        let media = await NXL.downloadMediaMessage(quotedMessage)
                        await NXL.sendMessage(targetJid, {
                            audio: media,
                            mimetype: 'audio/mp4'
                        })    
                    } else {
                        return m.reply(`Maaf, jenis pesan ini (${quotedMessage.mtype}) tidak bisa saya kirim ulang secara manual. Coba gunakan pesan teks, gambar, atau video.`)
                    }
                    m.reply('✅ Pesan berhasil dikirim ulang ke saluran.')
                } catch (error) {
                    console.error('Gagal mengirim ulang pesan:', error)
                    m.reply('Terjadi kesalahan saat mencoba mengirim pesan.')
                }
            }
            break
            
            default:
            if (budy.startsWith('=>')) {
                if (!isCreator) return false
                const Return = (sul) => {
                    sat = JSON.stringify(sul, null, 2)
                    bang = util.format(sat)
                    if (sat == undefined) {
                        bang = util.format(sul)
                    }
                }
                try {
                    reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
                } catch (e) {
                    reply(String(e))
                }
            }
            if (budy.startsWith('>')) {
                if (!isCreator) return false
                try {
                    let evaled = await eval(budy.slice(2))
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                    await reply(evaled)
                } catch (err) {
                    await reply(String(err))
                }
            }
            if (budy.startsWith('$')) {
                if(!isCreator) return false
                exec(budy.slice(2), (err, stdout) => {
                    if(err) return reply(err)
                    if (stdout) return reply(stdout)
                })
            }
            if (isCmd && budy.toLowerCase() != undefined) {
                if (from.endsWith('broadcast')) return
                if (m.isBaileys) return
                let msgs = global.db.data.database
                if (!(budy.toLowerCase() in msgs)) return
                NXL.copyNForward(from, msgs[budy.toLowerCase()], true)
            }
        }
    } catch (err) {
        console.log(util.format(err))
    }
}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})