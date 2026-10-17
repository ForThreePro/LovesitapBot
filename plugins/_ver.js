import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

if (!m.quoted) {
  let error = `╭───〔 *Lovesitap Bot* 〕───
│
│  *—◉ VER - ERROR*
│
│  ✿ No respondiste a nada
│  ✿ Responde a una foto/video
│    de una sola vista
│
│  🕒 ${fecha}
│
╰────────────────`
  return conn.reply(m.chat, error, m)
}

if (!m?.quoted || !m?.quoted?.viewOnce) {
  let error = `╭───〔 *Lovesitap Bot* 〕───
│
│  *—◉ VER - ERROR*
│
│  ✿ Ese mensaje no es
│    de una sola vista
│  ✿ Tiene que ser ViewOnce
│
│  🕒 ${fecha}
│
╰────────────────`
  return conn.reply(m.chat, error, m)
}

let buffer = await m.quoted.download(false);

let ok = `╭───〔 *Lovesitap Bot* 〕───
│
│  *—◉ VIEWONCE DESBLOQUEADO*
│
│  ✿ Se recupero el archivo
│  ✿ No se esconde nada aqui
│
│  🕒 ${fecha}
│
╰────────────────`

if (/videoMessage/.test(m.quoted.mtype)) {
  await conn.sendFile(m.chat, buffer, 'media.mp4', m.quoted.caption || ok, m)
} else if (/imageMessage/.test(m.quoted.mtype)) {
  await conn.sendFile(m.chat, buffer, 'media.jpg', m.quoted?.caption || ok, m)
}}

handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'ver'] 
handler.register = false 

export default handler