require('./settings')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    getAggregateVotesInPollMessage,
    proto
} = require("@whiskeysockets/baileys")
const fs = require('fs')
const pino = require('pino')
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const FileType = require('file-type')
const readline = require("readline")
const yargs = require('yargs/yargs')
const _ = require('lodash')
const { Boom } = require('@hapi/boom')
const PhoneNumber = require('awesome-phonenumber')
const ScammerApiReader = require('@dfansyah/scammer-api-reader')
const apiUrl = 'https://anti-ripper.my.id/api/v1'; 
const reader = new ScammerApiReader(apiUrl)
const {
    imageToWebp,
    imageToWebp3,
    videoToWebp,
    writeExifImg,
    writeExifImgAV,
    writeExifVid
} = require('./lib/exif')
const {
    smsg,
    isUrl,
    generateMessageTag,
    getBuffer,
    getSizeMedia,
    fetchJson,
    await,
    sleep
} = require('./lib/myfunc')

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise((resolve) => {
        rl.question(text, resolve)
    })
}

var low
try {
    low = require('lowdb')
} catch (e) {
    low = require('./lib/lowdb')
}
const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
    /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
    new mongoDB(opts['db']) :
    new JSONFile(`database/database.json`)
)
global.DATABASE = global.db
global.loadDatabase = async () => {
	if (global.db.READ) 
		return new Promise(resolve => 
			setInterval(function () {
				if (!global.db.READ) {
					clearInterval(this)
					resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
				}
			}, 1000)
		)
	if (global.db.data !== null) return
	global.db.READ = true
	await global.db.read()
	global.db.READ = false
	global.db.data = {
		users: {},
		chats: {},
		database: {},
		game: {},
		settings: {},
		others: {},
		stickers: {},
		anonymous: {},
		...(global.db.data || {})
	}
	global.db.chain = _.chain(global.db.data)
}
loadDatabase()
if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write()
}, 30 * 1000)


const connectToWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(global.sessionName)
    const NXL = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: !usePairingCode,
        auth: state,
        browser: ["Ubuntu", "Firefox", "20.0.04"],
        syncFullHistory: true,
    })
    if(usePairingCode && !NXL.authState.creds.registered) {
       
    NXL.ev.on('messages.upsert', async chatUpdate => {
        try {
            mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!NXL.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            m = smsg(NXL, mek, store)
            require("./case.js")(NXL, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })
    
    NXL.ev.on('call', async (celled) => {
        let botNumber = await NXL.decodeJid(NXL.user.id)
        let koloi = global.anticall
        if (!koloi) return
        console.log(celled)
        for (let kopel of celled) {
            if (kopel.isGroup == false) {
                if (kopel.status == "offer") {
                    let nomer = await NXL.sendTextWithMentions(kopel.from, `*${NXL.user.name}* tidak bisa menerima panggilan ${kopel.isVideo ? `video` : `suara`}. Maaf @${kopel.from.split('@')[0]} kamu akan diblokir. Silahkan hubungi Owner membuka blok !`)
                    NXL.sendContact(kopel.from, owner.map( i => i.split("@")[0]), nomer)
                    await sleep(8000)
                    await NXL.updateBlockStatus(kopel.from, "block")
                }
            }
        }
    })
    
    NXL.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = NXL.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })
    
    NXL.getName = (jid, withoutContact  = false) => {
        id = NXL.decodeJid(jid)
        withoutContact = NXL.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = NXL.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === NXL.decodeJid(NXL.user.id) ?
        NXL.user :
        (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    NXL.public = true
    NXL.ev.on('creds.update', saveCreds)
    
    NXL.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }
    
    NXL.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await NXL.sendMessage(jid, {
            image: buffer,
            caption: caption,
            ...options }, { quoted }
        )
    }
    
    NXL.sendText = (jid, text, quoted = '', options) => NXL.sendMessage(jid, { text: text, ...options }, { quoted })
    
    NXL.sendTextWithMentions = async (jid, text, quoted, options = {}) => NXL.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })
    
    NXL.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }
        await NXL.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
    
    NXL.sendImageAsStickerAV = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImgAV(buff, options)
        } else {
            buffer = await imageToWebp2(buff)
        }
        await NXL.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
    
    NXL.sendImageAsStickerAvatar = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp3(buff)
        }
        await NXL.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
    
    NXL.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }
        await NXL.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
    
    NXL.sendList = async (jid, title, footer, btn, options = {}) => {
        let msg = generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    "messageContextInfo": {
                        "deviceListMetadata": {},
                        "deviceListMetadataVersion": 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        ...options,
                        body: proto.Message.InteractiveMessage.Body.create({ text: title }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || "NextLevel | DFansyah" }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            button: [{
                                "name": "single_select",
                                "buttonParamsJson": JSON.stringify(btn)
                            },]
                        })
                    })
                }
            }
        }, {})
        return await NXL.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })
    }
    
    NXL.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }
    
    NXL.cMod = (jid, copy, text = '', sender = NXL.user.id, options = {}) => {
        let mtype = Object.keys(copy.message)[0]
        let isEphemeral = mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
        let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
        else if (content.caption) content.caption = text || content.caption
        else if (content.text) content.text = text || content.text
        if (typeof content !== 'string') msg[mtype] = {
            ...content,
            ...options
        }
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
        else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
        if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
        else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
        copy.key.remoteJid = jid
        copy.key.fromMe = sender === NXL.user.id
        return proto.WebMessageInfo.fromObject(copy)
    }
    
    NXL.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
        let types = await NXL.getFile(PATH, true)
        let { filename, size, ext, mime, data } = types
        let type = '', mimetype = mime, pathFile = filename
        if (options.asDocument) type = 'document'
        if (options.asSticker || /webp/.test(mime)) {
            let { writeExif } = require('./lib/sticker.js')
            let media = { mimetype: mime, data }
            pathFile = await writeExif(media, { packname: global.packname, author: global.packname2, categories: options.categories ? options.categories : [] })
            await fs.promises.unlink(filename)
            type = 'sticker'
            mimetype = 'image/webp'
        }
        else if (/image/.test(mime)) type = 'image'
        else if (/image/.test(mime)) type = 'video'
        else if (/image/.test(mime)) type = 'audio'
        else type = 'document'
        await NXL.sendMessage(jid, { [type]: { url: pathFile }, mimetype, fileName, ...options }, { quoted, ...options })
        return fs.promises.unlink(pathFile)
    }
    
    NXL.parseMention = async(text) => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
    
    NXL.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype
        if (options.readViewOnce) {
            message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
            vtype = Object.keys(message.message.viewOnceMessage.message)[0]
            delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
            delete message.message.viewOnceMessage.message[vtype].viewOnce
            message.message = {
                ...message.message.viewOnceMessage.message
            }
        }
        let mtype = Object.keys(message.message)[0]
        let content = await generateForwardMessageContent(message, forceForward)
        let ctype = Object.keys(content)[0]
        let context = {}
        if (mtype != "conversation") context = message.message[mtype].contextInfo
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        }
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {})
        await NXL.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
        return waMessage
    }
    
    NXL.sendReact = async (jid, emoticon, keys = {}) => {
        let reactionMessage = {
            react: {
                text: emoticon,
                key: keys
            }
        }
        return await NXL.sendMessage(jid, reactionMessage)
    }
    
    NXL.ev.on('group-participants.update', async (anu) => {
    try {
        const chat = global.db.data.chats[anu.id] || {};
        if (chat.autokick && anu.action === 'add') {
            console.log(chalk.green(`[Auto-Kick ON] Mendeteksi anggota baru di grup ${anu.id}`));
            const metadata = await NXL.groupMetadata(anu.id);
            const botId = NXL.user.id.split(':')[0] + '@s.whatsapp.net';
            const botIsAdmin = metadata.participants.find(p => p.id === botId)?.admin;

            if (botIsAdmin) {
                const rippers = await reader.getAll();
                const ripperNumbers = rippers.map(r => {
                    let num = r.contact.replace(/[^0-9]/g, '');
                    if (num.startsWith('08')) return '62' + num.substring(1);
                    return num;
                });
                
                for (const num of anu.participants) {
                    const userNumber = num.split('@')[0];
                    if (ripperNumbers.includes(userNumber)) {
                        await NXL.sendMessage(anu.id, { text: `⚠️ @${userNumber} ditolak masuk.\n*Alasan:* Terdeteksi dalam database ripper.`, mentions: [num] });
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        await NXL.groupParticipantsUpdate(anu.id, [num], 'remove');
                        continue;
                    }
                }
            }
        }
        if (!chat.welcome) return;

        console.log(anu);
        
        const metadata = await NXL.groupMetadata(anu.id);
        const participants = anu.participants;
        for (let num of participants) {
            let ppuser, ppgroup;
            try {
                ppuser = await NXL.profilePictureUrl(num, 'image');
            } catch {
                ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60';
            }
            try {
                ppgroup = await NXL.profilePictureUrl(anu.id, 'image');
            } catch {
                ppgroup = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60';
            }
        }
    } catch (err) {
        console.log(err);
    }
});

    
    NXL.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
            size: await getSizeMedia(data),
            ...type,
            data
        }
    }
    
    NXL.ev.on('messages.update', async (event) => {
        for(const { key, update } of event) {
            if(update.pollUpdates) {
                const pollCreation = await getMessage(key)
                if(pollCreation) {
                    console.log(
                        'got poll update, aggregation: ',
                        getAggregateVotesInPollMessage({
                            message: pollCreation,
                            pollUpdates: update.pollUpdates,
                        })
                    )
                }
            }
        }
    })
    
    NXL.serializeM = (m) => smsg(NXL, m, store)
    NXL.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update
            if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) {
                console.log(`Bad Session File, Please Delete Session and Scan Again`)
                process.exit()
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnecting....")
                connectToWhatsApp()
            } else if (reason === DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server, reconnecting...")
                connectToWhatsApp()
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log("Connection Replaced, Another New Session Opened, Please Restart Bot")
                process.exit()
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(`Device Logged Out, Please Delete Folder Session and Scan Again.`)
                process.exit()
            } else if (reason === DisconnectReason.restartRequired) {
                console.log("Restart Required, Restarting...")
                connectToWhatsApp()
            } else if (reason === DisconnectReason.timedOut) {
                console.log("Connection TimedOut, Reconnecting...")
                connectToWhatsApp()
            } else {
                console.log(`Unknown DisconnectReason: ${reason}|${connection}`)
                connectToWhatsApp()
            }
        }
    })
    return NXL
}
connectToWhatsApp()
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})
