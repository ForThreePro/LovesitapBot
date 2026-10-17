import { downloadContentFromMessage } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  try {
    if (!m.quoted) return conn.reply(m.chat, `《✧》 Responde a una imagen/video ViewOnce.`, m)
    
    let q = m.quoted
    // Checar si es ViewOnce de verdad
    if (!q.viewOnce && !q.message?.viewOnceMessageV2 && !q.mtype?.includes('viewOnce')) {
        return conn.reply(m.chat, `《✧》 Eso no es un ViewOnce bro.`, m)
    }

    await conn.sendMessage(m.chat, { react: { text: '👀', key: m.key } })

    // Intentar descargar con 2 métodos
    let buffer;
    try {
        buffer = await q.download()
    } catch {
        // Metodo 2 si falla el primero
        let type = Object.keys(q.message || {})[0] || 'imageMessage'
        if (q.message?.viewOnceMessageV2) {
            let inner = q.message.viewOnceMessageV2.message
            type = Object.keys(inner)[0]
            let msg = inner[type]
            let stream = await downloadContentFromMessage(msg, type.replace('Message','').replace('viewOnce','').toLowerCase() || 'image')
            let chunks = []
            for await (let chunk of stream) chunks.push(chunk)
            buffer = Buffer.concat(chunks)
        } else {
            throw 'No se pudo descargar'
        }
    }

    if (!buffer) return m.reply('❌ No pude descargar el ViewOnce')

    // Detectar si es video o imagen
    let mtype = q.mtype || ''
    if (/video/.test(mtype) || mtype.includes('video')) {
        return conn.sendFile(m.chat, buffer, 'viewonce.mp4', q.caption || '', m)
    } else {
        return conn.sendFile(m.chat, buffer, 'viewonce.jpg', q.caption || '', m)
    }

  } catch (e) {
    console.log(e)
    m.reply('❌ Error al ver el ViewOnce')
  }
}

handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'ver'] 
handler.register = true

export default handler