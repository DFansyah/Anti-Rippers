const fs = require('fs')
const chalk = require('chalk')
global.baileys = require('@whiskeysockets/baileys')
global.usePairingCode = true
global.ownername = 'DFansyah'
global.owner = ['6283145372436']
global.botname = 'Anti Rippers'
global.prefa = ['','!','.',',','🐤','🗿']
global.sessionName = 'session'
global.idchannel = '-'
global.linkgc = '-'
global.thumbnail = 'https://i.imgur.com/IDotbWR.png'
global.foter1 = 'Anti Rippers'
global.foter2 = 'Anti Rippers'
global.autobio = false
global.autoread = false
global.packname = 'Made By'
global.author = 'DFansyah'
global.skizo = "DFansyah"
global.wm = "AntiRippers"
global.onlypc = false
global.onlygc = false
global.limitawal = 10
global.balanceawal = 10000

global.mess = {
    done: ('ᴘʀosᴇs...'),
    owner: ('ᴀᴋꜱᴇꜱ ᴅɪ ᴛᴏʟᴀᴋ! ᴋʜᴜꜱᴜꜱ ᴏᴡɴᴇʀ!'),
    wait: ('ᴘʀosᴇs...!'),
    group: 'κнusus ԍʀouᴘ cнᴀт!',
    admin: 'κнusus ᴀᴅмιɴ ԍʀouᴘ!',
    botAdmin: 'ʙoт нᴀʀus ᴀᴅмιɴ!',
    linkvalid: 'ʟιɴκ тᴀuтᴀɴ тιᴅᴀκ vᴀʟιᴅ!', 
    error: 'ᴇʀoʀ тᴇʀנᴀᴅι κᴇsᴀʟᴀнᴀɴ!',
}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})