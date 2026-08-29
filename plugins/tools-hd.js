import axios from 'axios';
import FormData from 'form-data';

let handler = async (m, { conn, prefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) return m.reply(`🍰 Responde a una imagen con el comando *${prefix}${command}* para mejorar su calidad. 🌸`);
    if (!mime.startsWith('image')) return m.reply(`⚠️ Solo se admiten imágenes 🍜`);

    // Reacción de procesamiento
    await conn.sendMessage(m.chat, {
      react: { text: "⚡", key: m.key }
    });

    const media = await q.download();

    // Procesamiento con IA
    const enhancedBuffer = await ihancer(media, { method: 1, size: 'high' });

    const caption = `🍰 𓆩 𝗠𝗘𝗝𝗢𝗥𝗔 𝗖𝗢𝗡 𝗜𝗔 𓆪 🌸

.⃟𖥔 ݁. 𖦹˙— \`\`LOVESITAP AI\`\` —˙𖦹.🍜꒷

*━━━━━━━━━━*
*✨ CALIDAD MEJORADA*

*⚙️ Método:* iHancer AI
*🔝 Calidad:* High Max
*🤖 Bot:* Lovesitap Bot 🍰🌸🍜

*━━━━━━━━━━*
> _"Potenciado por IA para Lovesitap"_ 💎`;

    await conn.sendMessage(m.chat, {
      image: enhancedBuffer,
      caption
    }, { quoted: m });

    // Reacción de éxito
    await conn.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    });
    await m.reply("⚠️ Ocurrió un error al procesar la imagen con la IA 🍰");
  }
};

async function ihancer(buffer, { method = 1, size = 'low' } = {}) {
    const _size = ['low', 'medium', 'high']

    if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Se requiere una imagen')
    if (method < 1 || method > 4) throw new Error('Métodos disponibles: 1, 2, 3, 4')
    if (!_size.includes(size)) throw new Error(`Calidades disponibles: ${_size.join(', ')}`)

    const form = new FormData()
    form.append('method', method.toString())
    form.append('is_pro_version', 'false')
    form.append('is_enhancing_more', 'false')
    form.append('max_image_size', size)
    form.append('file', buffer, `lovesitap_${Date.now()}.jpg`) // Nombre actualizado

    const { data } = await axios.post('https://ihancer.com/api/enhance', form, {
        headers: {
            ...form.getHeaders(),
            'accept-encoding': 'gzip',
            'host': 'ihancer.com',
            'user-agent': 'Dart/3.5 (dart:io)'
        },
        responseType: 'arraybuffer'
    })

    return Buffer.from(data)
}

handler.help = ['hd'];
handler.tags = ['ai', 'imagen'];
handler.command = ['hd', 'upscale', 'enhance', 'remini'];

export default handler;