import fetch from 'node-fetch'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const react = async (emoji) => {
    try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }) } catch {}
  }

  let q = m.quoted ? m.quoted : m
  let txt = text || q.text || q.caption || q.body || ''

  if (!txt) {
    await react('❌')
    return m.reply(`𐔌 ꒱ ***BRAT*** 𐔌 ꒱ ⚠️

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR DE USO\`\` —˙𖦹.⚠️꒷

── *📖 USO* ╏
➛ ${usedPrefix}brat Hola

━━━━━━━━━━━`)
  }

  await react('🖌️')

  let apiUrl = `https://api.stellarwa.xyz/tools/brat?text=${encodeURIComponent(txt)}&key=proyectsV2`

  try {
    let response = await fetch(apiUrl)
    if (!response.ok) throw 'Api falló'

    let inputBuffer = await response.buffer()
    let tmpInput = path.join(tmpdir(), `brat-${Date.now()}.png`)
    let tmpOutput = path.join(tmpdir(), `brat-${Date.now()}.webp`)

    fs.writeFileSync(tmpInput, inputBuffer)

    await new Promise((resolve, reject) => {
      ffmpeg(tmpInput)
        .videoFilters('scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000')
        .toFormat('webp')
        .on('end', () => resolve(true))
        .on('error', (err) => reject(err))
        .save(tmpOutput)
    })

    let stickerBuffer = fs.readFileSync(tmpOutput)

    await conn.sendMessage(m.chat, {
      sticker: stickerBuffer,
      packname: 'Cotti Bots',
      author: 'Brat'
    }, { quoted: m })

    if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput)
    if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput)

    await react('✅')

  } catch (e) {
    console.log(e)
    await react('❌')
    return m.reply(`❌ Error con Stellar. Intenta de nuevo`)
  }
}

handler.help = ['brat <texto>']
handler.tags = ['sticker']
handler.command = /^brat$/i
export default handler